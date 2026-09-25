package br.org.senai.lab.resource;

import br.org.senai.lab.dto.RequestDtos;
import br.org.senai.lab.service.RequestService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/** Configurador on-line (anônimo): cria a SOL com origem "Configurador" e o snapshot técnico. Devolve só código e token de vínculo. */
@Path("/api/public/configurator") @Produces(MediaType.APPLICATION_JSON) @Consumes(MediaType.APPLICATION_JSON)
public class PublicConfiguratorResource {
  @Inject RequestService service;
  @POST public Response create(@Valid RequestDtos.Create dto){return Response.status(201).entity(service.createFromConfigurator(dto)).build();}
}
