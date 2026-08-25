import type {
  MachineId,
  ServiceId,
} from "../types";

export type ServiceDefinition = {
  id: ServiceId;

  name: string;

  shortName: string;

  /*
   * Linguagem usada principalmente na Etapa 01.
   */
  userFacingTitle: string;

  description: string;

  /*
   * Explicação pensada para alguém que não conhece
   * metrologia.
   */
  explanation: string;

  relatedMachines: MachineId[];
};

export const serviceCatalog: Record<
  ServiceId,
  ServiceDefinition
> = {
  dimensional: {
    id: "dimensional",

    name: "Inspeção dimensional",

    shortName: "Inspeção",

    userFacingTitle:
      "Conferir medidas, geometria ou tolerâncias",

    description:
      "Avaliação dimensional e geométrica de uma peça para verificar suas características e conformidade.",

    explanation:
      "Esse tipo de análise ajuda a descobrir se uma peça possui as medidas e características esperadas, por exemplo em relação a um desenho técnico, modelo CAD ou requisito de qualidade.",

    relatedMachines: [
      "prismo",
      "duramax",
      "o-inspect",
    ],
  },

  scan: {
    id: "scan",

    name: "Digitalização 3D",

    shortName: "Digitalização",

    userFacingTitle:
      "Obter uma representação 3D da peça",

    description:
      "Aquisição digital da geometria tridimensional externa do componente.",

    explanation:
      "A digitalização transforma a geometria física da peça em dados 3D que podem ser utilizados para inspeção, comparação com CAD, documentação, engenharia reversa ou outras aplicações.",

    relatedMachines: [
      "atos-q",
      "t-scan",
    ],
  },

  "reverse-engineering": {
    id: "reverse-engineering",

    name: "Engenharia reversa",

    shortName: "Engenharia reversa",

    userFacingTitle:
      "Reproduzir, reconstruir ou modificar uma peça",

    description:
      "Processo de obtenção ou reconstrução de informações digitais a partir de um componente físico.",

    explanation:
      "A engenharia reversa é útil quando existe uma peça física, mas é necessário criar, reconstruir, atualizar ou modificar seu modelo digital para documentação, desenvolvimento ou fabricação.",

    /*
     * Engenharia reversa não é uma máquina.
     *
     * Estes equipamentos podem participar da aquisição
     * conforme o tipo de geometria necessária.
     */
    relatedMachines: [
      "atos-q",
      "t-scan",
      "bosello-max",
    ],
  },

  internal: {
    id: "internal",

    name: "CT / análise interna",

    shortName: "Análise interna",

    userFacingTitle:
      "Investigar o interior da peça",

    description:
      "Análise não destrutiva e aquisição de informações de regiões internas do componente.",

    explanation:
      "Permite investigar regiões que não podem ser observadas apenas pela superfície externa, como geometrias internas, montagem, porosidade, defeitos ou posicionamento de componentes.",

    relatedMachines: [
      "bosello-max",
    ],
  },
};

export const serviceOrder: ServiceId[] = [
  "dimensional",
  "scan",
  "reverse-engineering",
  "internal",
];

/*
 * Utilitário para evitar repetir casts por toda a UI.
 */
export function getService(
  serviceId: ServiceId,
) {
  return serviceCatalog[
    serviceId
  ];
}

/*
 * Retorna todas as máquinas relacionadas aos serviços
 * informados sem repetir IDs.
 *
 * Será especialmente útil no Stage 01:
 * carrossel exploratório sem recomendação prematura.
 */
export function getCandidateMachines(
  services: ServiceId[],
): MachineId[] {
  const result =
    services.flatMap(
      (service) =>
        serviceCatalog[
          service
        ].relatedMachines,
    );

  return Array.from(
    new Set(result),
  );
}