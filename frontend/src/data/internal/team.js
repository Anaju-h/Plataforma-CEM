/*
 * ============================================================
 * EQUIPE — BASE TEMPORÁRIA
 * ============================================================
 *
 * Nesta primeira versão existe somente um perfil ativo:
 *
 * Administrador
 *
 * Não criamos colaboradores fictícios.
 *
 * Quando o modelo real de usuários for validado com a empresa,
 * estes registros serão migrados para backend/banco.
 * ============================================================
 */

export const teamMembers = [
  {
    id: "USR-0001",

    name: "Administrador",

    role:
      "Gerência do laboratório",

    email:
      "A definir",

    status:
      "Ativo",

    accessProfile:
      "Administrador",

    initials:
      "AD",

    /*
     * Perfil com acesso completo nesta fase.
     */
    permissions: [
      "dashboard",
      "requests",
      "quotes",
      "projects",
      "knowledge",
      "costs",
      "team",
      "administration",
    ],

    createdAt:
      "26/08/2026",
  },
];

export const futureAccessProfiles = [
  {
    id: "manager",

    name:
      "Administrador / Gerência",

    description:
      "Visão ampla da operação, gestão comercial, projetos, conhecimento e configurações.",

    status:
      "Em uso",
  },

  {
    id: "technical",

    name:
      "Equipe técnica",

    description:
      "Perfil previsto para execução de projetos, acompanhamento de atividades e consulta ao conhecimento.",

    status:
      "A validar",
  },

  {
    id: "commercial",

    name:
      "Comercial",

    description:
      "Perfil possível para solicitações, relacionamento com clientes e elaboração de propostas.",

    status:
      "A validar",
  },
];

export function getTeamMemberById(
  memberId,
) {
  return teamMembers.find(
    (member) =>
      member.id ===
      memberId,
  );
}