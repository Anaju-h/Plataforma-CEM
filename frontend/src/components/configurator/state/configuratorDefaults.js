export function createConfiguratorId(prefix = "item") {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function createDimensionalRequirements() {
  return {
    goals: [],

    toleranceKnowledge: null,

    criticalToleranceMm: "",

    technicalDrawing: null,

    cadModel: null,

    nonContactNeeded: null,

    smallFeatures: null,
  };
}

export function createScanningRequirements() {
  return {
    goals: [],

    detailLevel: null,

    surface: null,

    access: null,
  };
}

export function createReverseEngineeringRequirements() {
  return {
    goals: [],

    existingModel: null,

    geometryScope: null,

    needsModification: null,
  };
}

export function createCtRequirements() {
  return {
    goals: [],

    canBeDisassembled: null,

    mustRemainIntact: null,

    region: null,
  };
}

export function createPieceRequirements() {
  return {
    dimensional:
      createDimensionalRequirements(),

    scanning:
      createScanningRequirements(),

    reverseEngineering:
      createReverseEngineeringRequirements(),

    ct:
      createCtRequirements(),
  };
}

export function createPieceConfiguration(
  services = [],
) {
  return {
    id:
      createConfiguratorId("piece"),

    name: "",

    type: null,

    material: null,

    quantity: "1",

    dimensions: {
      length: "",
      width: "",
      height: "",
    },

    sizeCategory: null,

    location: null,

    services: [
      ...services,
    ],

    requirements:
      createPieceRequirements(),
  };
}

export function createCustomerData() {
  return {
    name: "",

    company: "",

    email: "",

    phone: "",

    department: "",
  };
}

export function createInitialConfiguratorState() {
  const firstPiece =
    createPieceConfiguration();

  return {
    currentStep: 1,

    highestStep: 1,

    projectServices: [],

    pieces: [
      firstPiece,
    ],

    activePieceId:
      firstPiece.id,

    customer:
      createCustomerData(),

    comments: "",

    attachments: [],
  };
}

export function duplicatePieceConfiguration(source) {
  return {
    ...source,

    id:
      createConfiguratorId("piece"),

    name: source.name
      ? `${source.name} - cópia`
      : "",

    dimensions: {
      ...source.dimensions,
    },

    services: [
      ...source.services,
    ],

    requirements: {
      dimensional: {
        ...source.requirements.dimensional,

        goals: [
          ...source.requirements.dimensional.goals,
        ],
      },

      scanning: {
        ...source.requirements.scanning,

        goals: [
          ...source.requirements.scanning.goals,
        ],
      },

      reverseEngineering: {
        ...source.requirements.reverseEngineering,

        goals: [
          ...source.requirements.reverseEngineering.goals,
        ],
      },

      ct: {
        ...source.requirements.ct,

        goals: [
          ...source.requirements.ct.goals,
        ],
      },
    },
  };
}

export function clearRemovedServiceRequirements(
  piece,
  nextServices,
) {
  return {
    ...piece,

    services: [
      ...nextServices,
    ],

    requirements: {
      dimensional:
        nextServices.includes("dimensional")
          ? piece.requirements.dimensional
          : createDimensionalRequirements(),

      scanning:
        nextServices.includes("scan")
          ? piece.requirements.scanning
          : createScanningRequirements(),

      reverseEngineering:
        nextServices.includes("reverse-engineering")
          ? piece.requirements.reverseEngineering
          : createReverseEngineeringRequirements(),

      ct:
        nextServices.includes("internal")
          ? piece.requirements.ct
          : createCtRequirements(),
    },
  };
}