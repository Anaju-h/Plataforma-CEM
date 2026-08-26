export const machineProfiles = {
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

      largeParts: 5,

      smallParts: 3,

      tactileFeatures: 5,

      opticalFeatures: 1,
    },
  },

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

      opticalFeatures: 5,

      tactileFeatures: 3,

      fineDetails: 4,
    },
  },

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

    mobile: false,

    strengths: {
      scanningPrecision: 5,

      smallParts: 5,

      largeParts: 2,

      fineDetails: 5,

      mobility: 1,
    },
  },

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

export function getMachineProfile(machineId) {
  return machineProfiles[machineId];
}

export function getAllMachineProfiles() {
  return Object.values(machineProfiles);
}