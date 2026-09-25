package br.org.senai.lab.security;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

/** PBKDF2-SHA256 from the JDK (OWASP-recommended iteration count). Format: pbkdf2-sha256$iterations$salt$hash. */
public final class PasswordHasher {
  private static final String PREFIX="pbkdf2-sha256";
  private static final int ITERATIONS=210_000;
  private static final SecureRandom RANDOM=new SecureRandom();
  private PasswordHasher(){}

  public static String hash(String password){
    byte[] salt=new byte[16];RANDOM.nextBytes(salt);
    byte[] derived=derive(password,salt,ITERATIONS);
    return PREFIX+"$"+ITERATIONS+"$"+Base64.getEncoder().encodeToString(salt)+"$"+Base64.getEncoder().encodeToString(derived);
  }

  public static boolean matches(String password,String stored){
    if(password==null||stored==null)return false;
    String[] parts=stored.split("\\$");
    if(parts.length!=4||!PREFIX.equals(parts[0]))return false;
    try{
      int iterations=Integer.parseInt(parts[1]);
      byte[] salt=Base64.getDecoder().decode(parts[2]);
      byte[] expected=Base64.getDecoder().decode(parts[3]);
      return MessageDigest.isEqual(expected,derive(password,salt,iterations));
    }catch(IllegalArgumentException e){return false;}
  }

  private static byte[] derive(String password,byte[] salt,int iterations){
    PBEKeySpec spec=new PBEKeySpec(password.toCharArray(),salt,iterations,256);
    try{return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();}
    catch(GeneralSecurityException e){throw new IllegalStateException(e);}
    finally{spec.clearPassword();}
  }
}
