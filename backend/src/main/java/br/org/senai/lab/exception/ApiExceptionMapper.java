package br.org.senai.lab.exception;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.*;
import java.util.Map;
@Provider
public class ApiExceptionMapper implements ExceptionMapper<ApiException> {
  public Response toResponse(ApiException e) { return Response.status(e.status).entity(Map.of("message",e.getMessage())).build(); }
}
