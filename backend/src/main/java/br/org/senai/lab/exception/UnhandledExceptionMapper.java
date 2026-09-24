package br.org.senai.lab.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.Map;
import org.jboss.logging.Logger;

@Provider
public class UnhandledExceptionMapper implements ExceptionMapper<Throwable> {

    private static final Logger LOG =
            Logger.getLogger(UnhandledExceptionMapper.class);

    @Override
    public Response toResponse(Throwable error) {
        LOG.error("Erro inesperado ao processar requisição", error);

        return Response.status(500)
                .entity(Map.of(
                        "message",
                        "Não foi possível concluir a operação."
                ))
                .build();
    }
}