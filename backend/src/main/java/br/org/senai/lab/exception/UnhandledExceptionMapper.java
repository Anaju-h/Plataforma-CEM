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
        // Erros HTTP do próprio JAX-RS (rota inexistente, método não permitido etc.) mantêm o status original.
        if (error instanceof jakarta.ws.rs.WebApplicationException web && web.getResponse().getStatus() < 500) {
            int status = web.getResponse().getStatus();
            return Response.status(status)
                    .entity(Map.of("message", status == 404 ? "Recurso não encontrado." : "Requisição inválida."))
                    .build();
        }
        LOG.error("Erro inesperado ao processar requisição", error);

        return Response.status(500)
                .entity(Map.of(
                        "message",
                        "Não foi possível concluir a operação."
                ))
                .build();
    }
}