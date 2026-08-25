import type {
  ConfiguratorState,
  CtRequirements,
  CustomerData,
  DimensionalRequirements,
  PieceConfiguration,
  PieceRequirements,
  ReverseEngineeringRequirements,
  ScanningRequirements,
  ServiceId,
} from "../types";

/*
 * ============================================================
 * IDs
 * ============================================================
 */

export function createConfiguratorId(
  prefix = "item",
): string {
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

/*
 * ============================================================
 * REQUISITOS — INSPEÇÃO DIMENSIONAL
 * ============================================================
 */

export function createDimensionalRequirements(): DimensionalRequirements {
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

/*
 * ============================================================
 * REQUISITOS — DIGITALIZAÇÃO
 * ============================================================
 */

export function createScanningRequirements(): ScanningRequirements {
  return {
    goals: [],

    detailLevel: null,

    surface: null,

    access: null,
  };
}

/*
 * ============================================================
 * REQUISITOS — ENGENHARIA REVERSA
 * ============================================================
 */

export function createReverseEngineeringRequirements(): ReverseEngineeringRequirements {
  return {
    goals: [],

    existingModel: null,

    geometryScope: null,

    needsModification: null,
  };
}

/*
 * ============================================================
 * REQUISITOS — CT / ANÁLISE INTERNA
 * ============================================================
 */

export function createCtRequirements(): CtRequirements {
  return {
    goals: [],

    canBeDisassembled: null,

    mustRemainIntact: null,

    region: null,
  };
}

/*
 * ============================================================
 * TODOS OS REQUISITOS DE UMA PEÇA
 * ============================================================
 */

export function createPieceRequirements(): PieceRequirements {
  return {
    dimensional: createDimensionalRequirements(),

    scanning: createScanningRequirements(),

    reverseEngineering:
      createReverseEngineeringRequirements(),

    ct: createCtRequirements(),
  };
}

/*
 * ============================================================
 * PEÇA
 * ============================================================
 */

export function createPieceConfiguration(
  services: ServiceId[] = [],
): PieceConfiguration {
  return {
    id: createConfiguratorId("piece"),

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

    services: [...services],

    requirements: createPieceRequirements(),
  };
}

/*
 * ============================================================
 * CLIENTE
 * ============================================================
 */

export function createCustomerData(): CustomerData {
  return {
    name: "",

    company: "",

    email: "",

    phone: "",

    department: "",
  };
}

/*
 * ============================================================
 * ESTADO INICIAL
 * ============================================================
 */

export function createInitialConfiguratorState(): ConfiguratorState {
  const firstPiece =
    createPieceConfiguration();

  return {
    currentStep: 1,

    highestStep: 1,

    projectServices: [],

    pieces: [firstPiece],

    activePieceId: firstPiece.id,

    customer: createCustomerData(),

    comments: "",

    attachments: [],
  };
}

/*
 * ============================================================
 * DUPLICAÇÃO DE PEÇA
 * ============================================================
 *
 * Fazemos uma cópia realmente independente.
 *
 * Assim alterar objetivos ou requisitos na peça duplicada
 * não modifica acidentalmente a peça original.
 */

export function duplicatePieceConfiguration(
  source: PieceConfiguration,
): PieceConfiguration {
  return {
    ...source,

    id: createConfiguratorId("piece"),

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

/*
 * ============================================================
 * LIMPEZA DE REQUISITOS DE SERVIÇO
 * ============================================================
 *
 * Quando o usuário remove um serviço de uma peça,
 * podemos limpar os dados daquele serviço para evitar
 * respostas antigas interferindo no motor posteriormente.
 */

export function clearRemovedServiceRequirements(
  piece: PieceConfiguration,
  nextServices: ServiceId[],
): PieceConfiguration {
  return {
    ...piece,

    services: [...nextServices],

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