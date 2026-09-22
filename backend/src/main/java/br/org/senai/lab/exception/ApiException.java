package br.org.senai.lab.exception;
public class ApiException extends RuntimeException {
  public final int status;
  public ApiException(int status,String message) { super(message); this.status=status; }
}
