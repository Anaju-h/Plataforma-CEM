package br.org.senai.lab.security;

import br.org.senai.lab.exception.ApiException;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * Limite de tentativas de login (OWASP A07 — falhas de identificação e autenticação).
 * <p>
 * Conta falhas por conta (tipo + e-mail) e por endereço IP numa janela deslizante. Ao atingir o limite,
 * novas tentativas recebem 429 até o bloqueio expirar; um login bem-sucedido zera o contador da conta.
 * Fica em memória: suficiente para uma instância. Com várias réplicas, o mesmo contrato iria para o Redis.
 */
@ApplicationScoped
public class LoginAttemptGuard {
  @ConfigProperty(name="lab.auth.max-attempts",defaultValue="5") int maxAttempts;
  @ConfigProperty(name="lab.auth.max-attempts-per-ip",defaultValue="20") int maxAttemptsPerIp;
  @ConfigProperty(name="lab.auth.lockout-minutes",defaultValue="15") long lockoutMinutes;

  Clock clock=Clock.systemUTC();
  private final Map<String,Deque<Instant>> failures=new ConcurrentHashMap<>();

  /** Lança 429 se a conta ou o IP estiverem bloqueados. */
  public void check(String kind,String email,String ip){
    long wait=Math.max(remaining(accountKey(kind,email),maxAttempts),remaining(ipKey(ip),maxAttemptsPerIp));
    if(wait>0)throw new ApiException(429,"Muitas tentativas de login. Tente novamente em "+Math.max(1,(wait+59)/60)+" minuto(s).");
  }

  public void failure(String kind,String email,String ip){
    record(accountKey(kind,email));record(ipKey(ip));
  }

  public void success(String kind,String email){failures.remove(accountKey(kind,email));}

  /** Segundos até liberar a chave, ou 0 se ainda não atingiu o limite. */
  long remaining(String key,int limit){
    Deque<Instant> attempts=failures.get(key);
    if(attempts==null)return 0;
    synchronized(attempts){
      prune(attempts);
      if(attempts.isEmpty()){failures.remove(key,attempts);return 0;}
      if(attempts.size()<limit)return 0;
      Instant releaseAt=attempts.peekFirst().plus(window());
      return Math.max(0,Duration.between(clock.instant(),releaseAt).toSeconds());
    }
  }

  private void record(String key){
    Deque<Instant> attempts=failures.computeIfAbsent(key,k->new ArrayDeque<>());
    synchronized(attempts){prune(attempts);attempts.addLast(clock.instant());}
  }

  private void prune(Deque<Instant> attempts){
    Instant limit=clock.instant().minus(window());
    while(!attempts.isEmpty()&&attempts.peekFirst().isBefore(limit))attempts.pollFirst();
  }

  private Duration window(){return Duration.ofMinutes(lockoutMinutes);}
  private static String accountKey(String kind,String email){return kind+":"+(email==null?"":email.trim().toLowerCase(Locale.ROOT));}
  private static String ipKey(String ip){return "ip:"+(ip==null?"?":ip);}
}
