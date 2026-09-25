package br.org.senai.lab.service;
import br.org.senai.lab.entity.CustomerUserEntity;
/** Identity boundary. Replace the temporary implementation with authenticated identity. */
public interface CustomerContext { CustomerUserEntity current(); }
