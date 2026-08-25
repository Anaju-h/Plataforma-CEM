import type {
  MachineId,
  MachineProfile,
} from "../types";

/*
 * ============================================================
 * PERFIS DAS TECNOLOGIAS DISPONÍVEIS NO CENTRO
 * ============================================================
 *
 * IMPORTANTE:
 *
 * Os strengths abaixo representam SOMENTE relações
 * qualitativas para estruturar o motor inicial.
 *
 * Eles NÃO representam:
 *
 * - precisão em µm;
 * - MPE;
 * - incerteza;
 * - capacidade real;
 * - limite dimensional;
 * - especificação comercial oficial.
 *
 * Os parâmetros técnicos absolutos serão cadastrados
 * depois com dados reais dos equipamentos do laboratório.
 */

export const machineProfiles: Record<
  MachineId,
  MachineProfile
> = {
  /*ZEISS PRISMO*/

  prismo: {
    id: "prismo",

    name: "ZEISS PRISMO",

    category:
      "Metrologia dimensional de alta precisão",

    description:
      "Sistema de medição por coordenadas relacionado a aplicações dimensionais e geométricas de maior exigência.",

    image:
      "/images/equipment/zeiss-prismo.png",

    services: [
      "dimensional",
    ],

    mobile: false,

    supportsTactile: true,

    supportsOptical: false,

    strengths: {
      dimensionalPrecision: 5,

      /*
       * Dentro da família dimensional do laboratório,
       * será considerada especialmente relevante quando
       * o porte começar a afastar tecnologias menores.
       *
       * O limite real só será aplicado quando tivermos
       * o volume do equipamento específico.
       */
      largeParts: 5,

      smallParts: 3,

      tactileFeatures: 5,

      opticalFeatures: 1,
    },
  },

  /*
   * ========================================================
   * ZEISS DURAMAX
   * ========================================================
   */

  duramax: {
    id: "duramax",

    name: "ZEISS DuraMax",

    category:
      "Metrologia dimensional",

    description:
      "Sistema de medição por coordenadas relacionado a controle dimensional de componentes compatíveis com sua capacidade.",

    image:
      "/images/equipment/zeiss-duramax.png",

    services: [
      "dimensional",
    ],

    mobile: false,

    supportsTactile: true,

    supportsOptical: false,

    strengths: {
      dimensionalPrecision: 3,

      smallParts: 5,

      largeParts: 1,

      tactileFeatures: 5,

      opticalFeatures: 1,
    },
  },

  /*
   * ========================================================
   * ZEISS O-INSPECT
   * ========================================================
   */

  "o-inspect": {
    id: "o-inspect",

    name: "ZEISS O-INSPECT",

    category:
      "Metrologia multissensor",

    description:
      "Sistema relacionado a aplicações dimensionais que podem combinar estratégias ópticas e táteis.",

    image:
      "/images/equipment/zeiss-o-inspect.png",

    services: [
      "dimensional",
    ],

    mobile: false,

    supportsTactile: true,

    supportsOptical: true,

    strengths: {
      dimensionalPrecision: 4,

      smallParts: 5,

      largeParts: 1,

      /*
       * Essa é uma das diferenças mais importantes
       * que o motor deverá considerar.
       */
      opticalFeatures: 5,

      tactileFeatures: 3,

      fineDetails: 4,
    },
  },

  /*
   * ========================================================
   * ZEISS ATOS Q
   * ========================================================
   */

  "atos-q": {
    id: "atos-q",

    name: "ZEISS ATOS Q",

    category:
      "Digitalização 3D óptica",

    description:
      "Sistema fixo de digitalização óptica relacionado a aquisições de alta qualidade, detalhes e aplicações de inspeção tridimensional.",

    image:
      "/images/equipment/zeiss-atos-q.png",

    services: [
      "scan",
      "reverse-engineering",
    ],

    /*
     * Conforme definimos:
     * ele NÃO deve receber vantagem por mobilidade.
     */
    mobile: false,

    strengths: {
      scanningPrecision: 5,

      smallParts: 5,

      largeParts: 2,

      fineDetails: 5,

      mobility: 1,
    },
  },

  /*
   * ========================================================
   * ZEISS T-SCAN
   * ========================================================
   */

  "t-scan": {
    id: "t-scan",

    name: "ZEISS T-SCAN",

    category:
      "Digitalização 3D portátil",

    description:
      "Sistema portátil de digitalização relacionado a peças maiores, estruturas e aplicações que exigem liberdade de movimentação ou aquisição no local.",

    image:
      "/images/equipment/zeiss-t-scan.png",

    services: [
      "scan",
      "reverse-engineering",
    ],

    mobile: true,

    strengths: {
      scanningPrecision: 4,

      smallParts: 2,

      largeParts: 5,

      fineDetails: 3,

      mobility: 5,
    },
  },

  /*
   * ========================================================
   * ZEISS BOSELLO MAX
   * ========================================================
   */

  "bosello-max": {
    id: "bosello-max",

    name: "ZEISS BOSELLO MAX",

    category:
      "Raios X / CT",

    description:
      "Sistema relacionado à análise não destrutiva e aquisição de informações volumétricas e internas do componente.",

    image:
      "/images/equipment/zeiss-bosello-max.png",

    services: [
      "internal",

      /*
       * Pode participar do fluxo de engenharia reversa
       * quando a geometria interna for relevante.
       */
      "reverse-engineering",
    ],

    mobile: false,

    strengths: {
      internalInspection: 5,

      volumetricScanning: 5,

      smallParts: 3,

      fineDetails: 3,
    },
  },
};

/* ============================================================
 * UTILITÁRIOS
 * ============================================================ */

export function getMachineProfile(
  machineId: MachineId,
) {
  return machineProfiles[
    machineId
  ];
}

export function getAllMachineProfiles() {
  return Object.values(
    machineProfiles,
  );
}