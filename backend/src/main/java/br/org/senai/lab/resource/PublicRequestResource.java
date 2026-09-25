package br.org.senai.lab.resource;

import br.org.senai.lab.dto.RequestDtos;
import br.org.senai.lab.service.RequestService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/** Anonymous site form. Returns only the SOL code and a one-time claim token; never internal fields. */
@Path("/api/public/requests") @Produces(MediaType.APPLICATION_JSON) @Consumes(MediaType.APPLICATION_JSON)
public class PublicRequestResource {
  @Inject RequestService service;
  @POST public Response create(@Valid RequestDtos.Create dto){return Response.status(201).entity(service.createPublic(dto)).build();}
}
