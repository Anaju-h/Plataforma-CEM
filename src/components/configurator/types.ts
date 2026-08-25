/*
 * ============================================================
 * CONFIGURADOR DE SOLUÇÕES — TIPOS CENTRAIS
 * ============================================================
 *
 * Fluxo definitivo:
 *
 * 01 Necessidade
 * 02 Peça
 * 03 Requisitos
 * 04 Refinamento
 * 05 Solicitação
 *
 * Este arquivo representa somente a arquitetura definitiva.
 * Não existem tipos legados da versão anterior.
 */

/* ============================================================
 * ETAPAS
 * ============================================================ */

export type ConfiguratorStep = 1 | 2 | 3 | 4 | 5;

/* ============================================================
 * SERVIÇOS
 * ============================================================ */

export type ServiceId =
  | "dimensional"
  | "scan"
  | "reverse-engineering"
  | "internal";

/* ============================================================
 * EQUIPAMENTOS
 * ============================================================ */

export type MachineId =
  | "prismo"
  | "duramax"
  | "o-inspect"
  | "atos-q"
  | "t-scan"
  | "bosello-max";

/*
 * candidate:
 * tecnologia relacionada, mas o configurador ainda
 * não possui informações suficientes para julgá-la.
 *
 * high/good/possible/low:
 * aderência progressivamente menor.
 *
 * review:
 * não há informação suficiente ou existe condição
 * que exige validação técnica antes de classificar.
 */
export type MatchLevel =
  | "candidate"
  | "high"
  | "good"
  | "possible"
  | "low"
  | "review";

/* ============================================================
 * INFORMAÇÕES GERAIS DA PEÇA
 * ============================================================ */

export type PieceType =
  | "component"
  | "assembly"
  | "structure"
  | "other"
  | "unknown";

export type MaterialType =
  | "steel"
  | "aluminum"
  | "other-metal"
  | "polymer"
  | "composite"
  | "ceramic"
  | "other"
  | "unknown";

/*
 * Usado quando o cliente não conhece as dimensões
 * exatas da peça.
 */
export type SizeCategory =
  | "hand"
  | "table"
  | "large"
  | "structure"
  | "unknown";

/*
 * Onde / como a peça poderá ser analisada.
 *
 * laboratory:
 * pode ir ao Centro.
 *
 * customer-site:
 * precisa ser analisada no cliente.
 *
 * installed:
 * permanece instalada em uma máquina ou estrutura.
 *
 * needs-guidance:
 * cliente não sabe qual logística é possível.
 */
export type PieceLocation =
  | "laboratory"
  | "customer-site"
  | "installed"
  | "needs-guidance"
  | "unknown";

export type YesNoUnknown =
  | "yes"
  | "no"
  | "unknown";

export type YesNoMaybeUnknown =
  | "yes"
  | "no"
  | "maybe"
  | "unknown";

export type PieceDimensions = {
  length: string;
  width: string;
  height: string;
};

/* ============================================================
 * INSPEÇÃO DIMENSIONAL
 * ============================================================ */

export type DimensionalGoal =
  | "general-dimensions"
  | "geometry"
  | "position"
  | "tolerances"
  | "drawing-conformity"
  | "quality-control"
  | "other"
  | "unknown";

export type CriticalToleranceKnowledge =
  | "exact"
  | "high-precision"
  | "exists-but-unknown"
  | "not-critical"
  | "unknown";

export type DimensionalRequirements = {
  /*
   * O cliente pode possuir vários objetivos na mesma peça.
   */
  goals: DimensionalGoal[];

  /*
   * Permite usar linguagem simples mesmo quando a pessoa
   * não conhece o valor da tolerância.
   */
  toleranceKnowledge: CriticalToleranceKnowledge | null;

  /*
   * Valor em mm quando toleranceKnowledge === "exact".
   */
  criticalToleranceMm: string;

  /*
   * Arquivos/documentações que o cliente declara possuir.
   */
  technicalDrawing: YesNoUnknown | null;
  cadModel: YesNoUnknown | null;

  /*
   * Pergunta apresentada ao usuário como:
   * "Existem características que precisam ser avaliadas
   * sem tocar na peça?"
   *
   * Ajuda principalmente a diferenciar aplicações
   * multissensor.
   */
  nonContactNeeded: YesNoMaybeUnknown | null;

  /*
   * Pequenos furos, detalhes ou características
   * potencialmente relevantes para estratégia óptica.
   */
  smallFeatures: YesNoUnknown | null;
};

/* ============================================================
 * DIGITALIZAÇÃO 3D
 * ============================================================ */

export type ScanningGoal =
  | "capture-geometry"
  | "cad-comparison"
  | "surface-analysis"
  | "digital-model"
  | "reverse-engineering"
  | "3d-print"
  | "other"
  | "unknown";

export type DetailLevel =
  | "general"
  | "visible-details"
  | "fine-details"
  | "maximum-fidelity"
  | "unknown";

export type SurfaceType =
  | "opaque"
  | "reflective"
  | "dark"
  | "transparent"
  | "mixed"
  | "unknown";

export type AccessLevel =
  | "full"
  | "partial"
  | "difficult"
  | "unknown";

export type ScanningRequirements = {
  goals: ScanningGoal[];

  detailLevel: DetailLevel | null;

  surface: SurfaceType | null;

  /*
   * Capacidade de acessar diferentes regiões da peça.
   */
  access: AccessLevel | null;
};

/* ============================================================
 * ENGENHARIA REVERSA
 * ============================================================ */

export type ReverseEngineeringGoal =
  | "cad-model"
  | "full-reconstruction"
  | "partial-reconstruction"
  | "editable-model"
  | "manufacturing-file"
  | "update-existing-project"
  | "other"
  | "unknown";

export type GeometryScope =
  | "external"
  | "internal"
  | "both"
  | "unknown";

export type ExistingModelStatus =
  | "yes"
  | "no"
  | "outdated"
  | "unknown";

export type ReverseEngineeringRequirements = {
  goals: ReverseEngineeringGoal[];

  /*
   * Existe CAD / modelo anterior?
   */
  existingModel: ExistingModelStatus | null;

  /*
   * Ajuda a decidir qual forma de aquisição pode entrar
   * no processo de engenharia reversa.
   */
  geometryScope: GeometryScope | null;

  /*
   * O resultado precisa permitir alterações de projeto?
   */
  needsModification: YesNoUnknown | null;
};

/* ============================================================
 * CT / ANÁLISE INTERNA
 * ============================================================ */

export type CtGoal =
  | "internal-geometry"
  | "defects"
  | "porosity"
  | "assembly"
  | "internal-position"
  | "internal-dimensions"
  | "internal-reconstruction"
  | "other"
  | "unknown";

export type CtRegion =
  | "whole-piece"
  | "specific-region"
  | "assembled-set"
  | "unknown";

export type CtRequirements = {
  goals: CtGoal[];

  canBeDisassembled: YesNoUnknown | null;

  /*
   * Se precisa permanecer intacta, a natureza
   * não destrutiva da análise ganha importância.
   */
  mustRemainIntact: YesNoUnknown | null;

  region: CtRegion | null;
};

/* ============================================================
 * REQUISITOS COMPLETOS DE UMA PEÇA
 * ============================================================ */

export type PieceRequirements = {
  dimensional: DimensionalRequirements;

  scanning: ScanningRequirements;

  reverseEngineering: ReverseEngineeringRequirements;

  ct: CtRequirements;
};

/* ============================================================
 * PEÇA / COMPONENTE
 * ============================================================ */

export type PieceConfiguration = {
  id: string;

  /*
   * Opcional para o usuário.
   * Ex.: "Carcaça", "Flange", "Coletor".
   */
  name: string;

  type: PieceType | null;

  material: MaterialType | null;

  /*
   * Unidades do MESMO componente.
   *
   * Uma peça diferente gera outro PieceConfiguration.
   */
  quantity: string;

  /*
   * O usuário pode fornecer dimensões reais...
   */
  dimensions: PieceDimensions;

  /*
   * ...ou uma categoria aproximada caso não saiba.
   */
  sizeCategory: SizeCategory | null;

  location: PieceLocation | null;

  /*
   * Uma mesma peça pode receber vários serviços.
   */
  services: ServiceId[];

  requirements: PieceRequirements;
};

/* ============================================================
 * CLIENTE — ETAPA 05
 * ============================================================ */

export type CustomerData = {
  name: string;

  company: string;

  email: string;

  phone: string;

  /*
   * Opcional.
   * Ex.: Qualidade, Engenharia, Compras.
   */
  department: string;
};

/* ============================================================
 * ANEXOS — ETAPA 05
 * ============================================================ */

export type AttachmentCategory =
  | "photo"
  | "technical-drawing"
  | "cad"
  | "document"
  | "other";

export type ProjectAttachment = {
  id: string;

  file: File;

  category: AttachmentCategory;
};

/* ============================================================
 * ESTADO CENTRAL DO CONFIGURADOR
 * ============================================================ */

export type ConfiguratorState = {
  currentStep: ConfiguratorStep;

  /*
   * Controla até onde a barra superior pode ser clicada.
   */
  highestStep: ConfiguratorStep;

  /*
   * Serviços identificados inicialmente para o projeto.
   *
   * Cada peça poderá depois possuir sua própria combinação.
   */
  projectServices: ServiceId[];

  pieces: PieceConfiguration[];

  activePieceId: string;

  customer: CustomerData;

  comments: string;

  attachments: ProjectAttachment[];
};

/* ============================================================
 * PERFIL DAS MÁQUINAS
 * ============================================================ */

export type MachineStrengths = {
  dimensionalPrecision?: number;

  scanningPrecision?: number;

  smallParts?: number;

  largeParts?: number;

  fineDetails?: number;

  mobility?: number;

  opticalFeatures?: number;

  tactileFeatures?: number;

  internalInspection?: number;

  volumetricScanning?: number;
};

export type MachineProfile = {
  id: MachineId;

  name: string;

  category: string;

  description: string;

  image: string;

  services: ServiceId[];

  mobile: boolean;

  supportsTactile?: boolean;

  supportsOptical?: boolean;

  /*
   * Valores relativos usados pelo motor.
   *
   * 1 = baixa relevância
   * 5 = forte característica
   *
   * Não representam porcentagem ou especificação metrológica.
   */
  strengths: MachineStrengths;

  /*
   * Será preenchido apenas com dados reais dos equipamentos
   * existentes no Centro.
   *
   * Até isso acontecer, nenhuma máquina será eliminada
   * automaticamente por um limite inventado.
   */
  capacity?: {
    x: number;
    y: number;
    z: number;
    unit: "mm";
  };
};

/* ============================================================
 * RECOMENDAÇÃO
 * ============================================================ */

export type MachineMatch = {
  machineId: MachineId;

  /*
   * Score interno para ordenação.
   * Não precisamos exibi-lo como porcentagem ao cliente.
   */
  score: number;

  level: MatchLevel;

  reasons: string[];

  warnings: string[];

  /*
   * Informações que poderiam melhorar o julgamento.
   */
  missingInformation: string[];
};

export type ServiceRecommendation = {
  service: ServiceId;

  /*
   * Pode permanecer null enquanto ainda estamos
   * na fase de exploração.
   */
  primaryMachine: MachineId | null;

  matches: MachineMatch[];

  /*
   * Ex.:
   * "A aplicação dimensional possui elevada exigência
   * de precisão e características geométricas."
   */
  interpretation: string;
};

export type PieceRecommendation = {
  pieceId: string;

  services: ServiceRecommendation[];

  /*
   * Nível de definição das informações, NÃO confiança
   * científica da recomendação.
   */
  definitionScore: number;

  /*
   * Tradução em linguagem natural do que o sistema
   * entendeu sobre a peça.
   */
  summary: string;

  insights: string[];

  missingInformation: string[];
};

export type ProjectRecommendation = {
  pieces: PieceRecommendation[];

  /*
   * Resultado agregado para alimentar o stage.
   */
  machineMatches: MachineMatch[];

  activeMachines: MachineId[];

  definitionScore: number;

  summary: string;

  insights: string[];

  missingInformation: string[];
};

/* ============================================================
 * REFINAMENTO — ETAPA 04
 * ============================================================ */

export type RefinementQuestionId =
  | "dimensional-tolerance"
  | "dimensional-contact"
  | "scanning-detail"
  | "scanning-location"
  | "reverse-geometry-scope"
  | "ct-region";

export type RefinementQuestion = {
  id: RefinementQuestionId;

  pieceId: string;

  service: ServiceId;

  title: string;

  explanation: string;

  /*
   * Quanto esta informação importa para resolver
   * uma ambiguidade existente.
   */
  priority: number;
};