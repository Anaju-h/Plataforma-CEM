export type ServiceType =
  | "inspection"
  | "scanning"
  | "reverse"
  | "internal";

export type TransportStatus =
  | "yes"
  | "no"
  | "unknown";

export type InspectionOption =
  | "dimensions"
  | "geometry"
  | "tolerances"
  | "drawing"
  | "cad"
  | "other";

export type ScanningOption =
  | "model"
  | "cadComparison"
  | "documentation"
  | "reverseBase"
  | "other";

export type ReverseOption =
  | "cad"
  | "surfaces"
  | "reconstruction"
  | "modification"
  | "unknown";

export type InternalOption =
  | "structure"
  | "defects"
  | "cavities"
  | "assembly"
  | "discontinuities"
  | "other";

/* =========================================================
   PEÇAS
========================================================= */

export type PieceData = {
  id: string;

  /* Identificação */
  name: string;
  quantity: number;

  /* Material */
  material: string;

  /* Dimensões aproximadas */
  length: string;
  width: string;
  height: string;
  unit: "mm" | "cm" | "m";

  /* Serviços necessários para esta peça */
  services: ServiceType[];

  /* Inspeção dimensional */
  inspectionOptions: InspectionOption[];

  /* Digitalização 3D */
  scanningOptions: ScanningOption[];

  /* Engenharia reversa */
  reverseOptions: ReverseOption[];

  /* Análise interna */
  internalOptions: InternalOption[];

  /* Transporte da peça até o laboratório */
  transportStatus: TransportStatus;

  /* Necessidade de atendimento externo / in loco */
  externalService: boolean;

  /* Local do atendimento externo */
  locationCity: string;
  locationState: string;

  /* Condições da peça no local */
  movable: "yes" | "no" | "partial" | "";

  surroundingAccess:
    | "yes"
    | "partial"
    | "unknown"
    | "";

  /* Informações adicionais sobre o local */
  locationNotes: string;
};

/* =========================================================
   PROJETO
========================================================= */

export type ProjectUrgency =
  | "normal"
  | "priority"
  | "urgent";

export type DeadlineType =
  | "noUrgency"
  | "15days"
  | "30days"
  | "specificDate";

export type ProjectData = {
  /* Objetivo geral da solicitação */
  objective: string;

  /* Prioridade */
  urgency: ProjectUrgency;

  /* Prazo */
  deadlineType: DeadlineType;

  /* Utilizado quando deadlineType === "specificDate" */
  specificDate: string;

  /* Observações gerais */
  observations: string;

  /* Arquivos relacionados ao projeto como um todo */
  generalFiles: File[];
};