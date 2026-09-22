package br.org.senai.lab.exception;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.*;
import java.util.Map;
@Provider
public class ValidationExceptionMapper implements ExceptionMapper<ConstraintViolationException> {
  public Response toResponse(ConstraintViolationException ignored) {
    return Response.status(400).entity(Map.of("message","Dados da solicitação inválidos.")).build();
  }
}
