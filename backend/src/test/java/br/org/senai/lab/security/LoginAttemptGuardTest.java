package br.org.senai.lab.security;

import br.org.senai.lab.exception.ApiException;
import java.time.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

/** Limite de tentativas de login: bloqueia após N falhas na janela e libera quando a janela passa. */
class LoginAttemptGuardTest {
  private LoginAttemptGuard guard;
  private MutableClock clock;

  @BeforeEach void setUp(){
    guard=new LoginAttemptGuard();guard.maxAttempts=5;guard.maxAttemptsPerIp=20;guard.lockoutMinutes=15;
    clock=new MutableClock(Instant.parse("2026-09-25T12:00:00Z"));guard.clock=clock;
  }

  @Test void blocksAccountAfterFiveFailures(){
    for(int i=0;i<4;i++){guard.check("internal","tecnico@lab.local","10.0.0.1");guard.failure("internal","tecnico@lab.local","10.0.0.1");}
    guard.check("internal","TECNICO@lab.local ","10.0.0.1");
    guard.failure("internal","tecnico@lab.local","10.0.0.1");
    var e=assertThrows(ApiException.class,()->guard.check("internal","tecnico@lab.local","10.0.0.2"));
    assertEquals(429,e.status);
    // Outra conta e o outro portal seguem livres.
    assertDoesNotThrow(()->guard.check("internal","validador@lab.local","10.0.0.2"));
    assertDoesNotThrow(()->guard.check("customer","tecnico@lab.local","10.0.0.2"));
  }

  @Test void releasesAfterTheWindow(){
    for(int i=0;i<5;i++)guard.failure("customer","ana@gmail.com","10.0.0.1");
    assertThrows(ApiException.class,()->guard.check("customer","ana@gmail.com","10.0.0.1"));
    clock.advance(Duration.ofMinutes(15).plusSeconds(1));
    assertDoesNotThrow(()->guard.check("customer","ana@gmail.com","10.0.0.1"));
  }

  @Test void successResetsTheAccount(){
    for(int i=0;i<4;i++)guard.failure("internal","admin@lab.local","10.0.0.1");
    guard.success("internal","admin@lab.local");
    for(int i=0;i<4;i++)guard.failure("internal","admin@lab.local","10.0.0.1");
    assertDoesNotThrow(()->guard.check("internal","admin@lab.local","10.0.0.1"));
  }

  @Test void blocksAnIpTryingManyAccounts(){
    for(int i=0;i<20;i++)guard.failure("internal","conta"+i+"@lab.local","10.9.9.9");
    assertThrows(ApiException.class,()->guard.check("internal","nova@lab.local","10.9.9.9"));
    assertDoesNotThrow(()->guard.check("internal","nova@lab.local","10.0.0.7"));
  }

  static final class MutableClock extends Clock {
    private Instant now;
    MutableClock(Instant now){this.now=now;}
    void advance(Duration d){now=now.plus(d);}
    @Override public ZoneId getZone(){return ZoneOffset.UTC;}
    @Override public Clock withZone(ZoneId zone){return this;}
    @Override public Instant instant(){return now;}
  }
}
