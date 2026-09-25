package br.org.senai.lab.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

/** Random one-time tokens and their SHA-256 fingerprints (only the fingerprint is stored). */
public final class Tokens {
  private static final SecureRandom RANDOM=new SecureRandom();
  private Tokens(){}
  public static String random(){
    byte[] bytes=new byte[32];RANDOM.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }
  public static String sha256(String value){
    try{return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));}
    catch(NoSuchAlgorithmException e){throw new IllegalStateException(e);}
  }
  public static boolean sameHash(String value,String expectedHash){
    if(value==null||expectedHash==null)return false;
    return MessageDigest.isEqual(sha256(value).getBytes(StandardCharsets.UTF_8),expectedHash.getBytes(StandardCharsets.UTF_8));
  }
}
