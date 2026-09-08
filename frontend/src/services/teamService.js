import {
  futureAccessProfiles,
  teamMembers,
} from "../data/internal/team";

import {
  getRuntimeProjects,
} from "./projectService";

import {
  getRuntimeQuotes,
} from "./quoteService";

/*
 * ============================================================
 * SERVIÇO TEMPORÁRIO DE EQUIPE
 * ============================================================
 */

export function getTeamOverview() {
  const projects =
    getRuntimeProjects();

  const quotes =
    getRuntimeQuotes();

  const members =
    teamMembers.map(
      (member) => {
        const assignedProjects =
          projects.filter(
            (project) =>
              project.responsible ===
              member.name,
          );

        const activeProjects =
          assignedProjects.filter(
            (project) =>
              ![
                "Concluído",
                "Cancelado",
              ].includes(
                project.status,
              ),
          );

        const assignedQuotes =
          quotes.filter(
            (quote) =>
              quote.responsible ===
              member.name,
          );

        const activeQuotes =
          assignedQuotes.filter(
            (quote) =>
              ![
                "Aceito",
                "Recusado",
                "Cancelado",
              ].includes(
                quote.status,
              ),
          );

        return {
          ...member,

          assignedProjects,

          activeProjects,

          assignedQuotes,

          activeQuotes,
        };
      },
    );

  return {
    members,

    profiles:
      futureAccessProfiles,

    activeMembers:
      members.filter(
        (member) =>
          member.status ===
          "Ativo",
      ).length,

    activeProjects:
      projects.filter(
        (project) =>
          ![
            "Concluído",
            "Cancelado",
          ].includes(
            project.status,
          ),
      ).length,

    activeQuotes:
      quotes.filter(
        (quote) =>
          ![
            "Aceito",
            "Recusado",
            "Cancelado",
          ].includes(
            quote.status,
          ),
      ).length,
  };
}