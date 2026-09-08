/*
 * ============================================================
 * ADMINISTRAÇÃO — CONFIGURAÇÃO INICIAL
 * ============================================================
 */

export const initialGeneralSettings = {
  defaultQuoteValidityDays:
    15,

  defaultExecutionDeadlineDays:
    0,

  defaultResponsible:
    "Administrador",

  initialProjectStatus:
    "Planejamento",

  requireAcceptedQuoteForProject:
    true,

  requireQuoteReviewBeforeSending:
    true,

  requestPrefix:
    "SOL",

  quotePrefix:
    "ORC",

  projectPrefix:
    "PRJ",
};

/*
 * ============================================================
 * REGRAS DE ATENÇÃO
 * ============================================================
 *
 * Os números abaixo são parâmetros iniciais do protótipo.
 * O administrador pode alterá-los pela interface.
 * ============================================================
 */

export const initialAttentionRules = [
  /*
   * ----------------------------------------------------------
   * SOLICITAÇÕES
   * ----------------------------------------------------------
   */

  {
    id:
      "request-new",

    entity:
      "Solicitação",

    situation:
      "Nova",

    attentionAfterDays:
      1,

    urgentAfterDays:
      3,

    enabled:
      true,

    description:
      "Sinaliza solicitações recebidas que ainda não tiveram a análise iniciada.",
  },

  {
    id:
      "request-analysis",

    entity:
      "Solicitação",

    situation:
      "Em análise",

    attentionAfterDays:
      2,

    urgentAfterDays:
      5,

    enabled:
      true,

    description:
      "Sinaliza solicitações cuja análise foi iniciada, mas permanece sem avanço.",
  },

  {
    id:
      "request-information",

    entity:
      "Solicitação",

    situation:
      "Aguardando informações",

    attentionAfterDays:
      3,

    urgentAfterDays:
      7,

    enabled:
      true,

    description:
      "Ajuda a acompanhar solicitações que dependem de informações adicionais para continuar.",
  },

  /*
   * ----------------------------------------------------------
   * ORÇAMENTOS
   * ----------------------------------------------------------
   */

  {
    id:
      "quote-draft",

    entity:
      "Orçamento",

    situation:
      "Em elaboração",

    attentionAfterDays:
      3,

    urgentAfterDays:
      7,

    enabled:
      true,

    description:
      "Sinaliza propostas que foram iniciadas e permaneceram sem conclusão.",
  },

  {
    id:
      "quote-review",

    entity:
      "Orçamento",

    situation:
      "Em revisão",

    attentionAfterDays:
      2,

    urgentAfterDays:
      5,

    enabled:
      true,

    description:
      "Prioriza propostas que estão aguardando revisão interna.",
  },

  /*
   * ----------------------------------------------------------
   * PROJETOS
   * ----------------------------------------------------------
   */

  {
    id:
      "project-inactivity",

    entity:
      "Projeto",

    situation:
      "Sem atualização",

    attentionAfterDays:
      5,

    urgentAfterDays:
      10,

    enabled:
      true,

    description:
      "Ajuda a identificar projetos ativos que permaneceram sem movimentação.",
  },

  {
    id:
      "project-deadline",

    entity:
      "Projeto",

    situation:
      "Prazo próximo",

    attentionAfterDays:
      5,

    urgentAfterDays:
      2,

    enabled:
      true,

    mode:
      "before-deadline",

    description:
      "Define quando um prazo futuro começa a receber destaque no portal.",
  },
];

/*
 * ============================================================
 * INTEGRAÇÕES
 * ============================================================
 */

export const integrationCatalog = [
  {
    id:
      "email",

    name:
      "E-mail",

    description:
      "Envio de propostas, avisos e comunicações a partir do portal.",

    status:
      "Não configurado",

    type:
      "communication",
  },

  {
    id:
      "microsoft",

    name:
      "Microsoft 365",

    description:
      "Possível integração futura com serviços corporativos e gestão de trabalho.",

    status:
      "A validar",

    type:
      "corporate",
  },

  {
    id:
      "storage",

    name:
      "Armazenamento de arquivos",

    description:
      "Persistência de anexos, documentos técnicos e arquivos dos projetos.",

    status:
      "A definir",

    type:
      "storage",
  },

  {
    id:
      "notifications",

    name:
      "Notificações",

    description:
      "Motor de alertas do portal para prazos, pendências e mudanças relevantes.",

    status:
      "Planejado",

    type:
      "internal",
  },
];

/*
 * ============================================================
 * AUDITORIA
 * ============================================================
 */

export const initialAuditEvents = [
  {
    id:
      "AUD-0001",

    action:
      "Referência comercial registrada",

    area:
      "Equipamentos e custos",

    actor:
      "Administrador",

    date:
      "26/08/2026",

    description:
      "Registro inicial da referência comercial utilizada pelo laboratório.",
  },

  {
    id:
      "AUD-0002",

    action:
      "Estrutura administrativa criada",

    area:
      "Administração",

    actor:
      "Administrador",

    date:
      "27/08/2026",

    description:
      "Configuração inicial das regras administrativas e operacionais do portal.",
  },
];