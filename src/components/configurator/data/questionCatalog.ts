import type {
  AccessLevel,
  CriticalToleranceKnowledge,
  CtGoal,
  DetailLevel,
  DimensionalGoal,
  ExistingModelStatus,
  GeometryScope,
  MaterialType,
  PieceLocation,
  PieceType,
  ReverseEngineeringGoal,
  ScanningGoal,
  SizeCategory,
  SurfaceType,
  YesNoMaybeUnknown,
  YesNoUnknown,
} from "../types";

export type QuestionOption<T> = {
  value: T;

  label: string;

  description?: string;
};

/*
 * PEÇA
 */

export const pieceTypeOptions: QuestionOption<PieceType>[] =
  [
    {
      value: "component",
      label:
        "Peça individual",
      description:
        "Um único componente ou peça.",
    },

    {
      value: "assembly",
      label:
        "Conjunto montado",
      description:
        "Duas ou mais peças que trabalham ou são analisadas juntas.",
    },

    {
      value: "structure",
      label:
        "Estrutura ou máquina",
      description:
        "Estrutura de maior porte ou componente instalado em equipamento.",
    },

    {
      value: "other",
      label: "Outro",
    },

    {
      value: "unknown",
      label:
        "Não sei classificar",
    },
  ];

export const materialOptions: QuestionOption<MaterialType>[] =
  [
    {
      value: "steel",
      label: "Aço",
    },

    {
      value: "aluminum",
      label:
        "Alumínio",
    },

    {
      value:
        "other-metal",
      label:
        "Outro metal",
    },

    {
      value: "polymer",
      label:
        "Polímero / plástico",
    },

    {
      value: "composite",
      label:
        "Compósito",
    },

    {
      value: "ceramic",
      label:
        "Cerâmica",
    },

    {
      value: "other",
      label: "Outro",
    },

    {
      value: "unknown",
      label: "Não sei",
    },
  ];

export const sizeCategoryOptions: QuestionOption<SizeCategory>[] =
  [
    {
      value: "hand",
      label:
        "Cabe na mão",
      description:
        "Peça de pequeno porte.",
    },

    {
      value: "table",
      label:
        "Cabe sobre uma mesa",
      description:
        "Peça pequena ou média que pode ser movimentada com facilidade.",
    },

    {
      value: "large",
      label:
        "Grande / difícil de movimentar",
      description:
        "Pode exigir apoio de mais pessoas ou equipamento para movimentação.",
    },

    {
      value: "structure",
      label:
        "Estrutura ou máquina de grande porte",
      description:
        "Componente grande, estrutura ou equipamento instalado.",
    },

    {
      value: "unknown",
      label:
        "Não sei estimar",
    },
  ];

export const pieceLocationOptions: QuestionOption<PieceLocation>[] =
  [
    {
      value:
        "laboratory",
      label:
        "Pode ser levada ao Centro",
    },

    {
      value:
        "customer-site",
      label:
        "Precisa ser analisada no local",
    },

    {
      value:
        "installed",
      label:
        "Está instalada em uma máquina ou estrutura",
    },

    {
      value:
        "needs-guidance",
      label:
        "Preciso de orientação sobre isso",
    },

    {
      value: "unknown",
      label:
        "Ainda não sei",
    },
  ];

/*
 * RESPOSTAS COMUNS
 */

export const yesNoUnknownOptions: QuestionOption<YesNoUnknown>[] =
  [
    {
      value: "yes",
      label: "Sim",
    },

    {
      value: "no",
      label: "Não",
    },

    {
      value: "unknown",
      label:
        "Não sei",
    },
  ];

export const yesNoMaybeUnknownOptions: QuestionOption<YesNoMaybeUnknown>[] =
  [
    {
      value: "yes",
      label: "Sim",
    },

    {
      value: "no",
      label: "Não",
    },

    {
      value: "maybe",
      label:
        "Talvez / depende",
    },

    {
      value: "unknown",
      label:
        "Não sei",
    },
  ];

/*
 * INSPEÇÃO DIMENSIONAL
 */

export const dimensionalGoalOptions: QuestionOption<DimensionalGoal>[] =
  [
    {
      value:
        "general-dimensions",
      label:
        "Medidas gerais",
      description:
        "Comprimentos, diâmetros, alturas e outras dimensões.",
    },

    {
      value: "geometry",
      label:
        "Forma e geometria",
    },

    {
      value: "position",
      label:
        "Posição de características",
    },

    {
      value: "tolerances",
      label:
        "Tolerâncias",
    },

    {
      value:
        "drawing-conformity",
      label:
        "Conformidade com desenho",
    },

    {
      value:
        "quality-control",
      label:
        "Controle de qualidade",
    },

    {
      value: "other",
      label: "Outro",
    },

    {
      value: "unknown",
      label:
        "Não sei exatamente",
    },
  ];

export const toleranceKnowledgeOptions: QuestionOption<CriticalToleranceKnowledge>[] =
  [
    {
      value: "exact",
      label:
        "Sei o valor da menor tolerância",
      description:
        "Você poderá informar o valor em milímetros.",
    },

    {
      value:
        "high-precision",
      label:
        "Sei que exige alta precisão, mas não conheço o valor",
    },

    {
      value:
        "exists-but-unknown",
      label:
        "Existem tolerâncias, mas não sei quais são",
    },

    {
      value: "unknown",
      label:
        "Não sei informar",
    },
  ];

/*
 * DIGITALIZAÇÃO
 */

export const scanningGoalOptions: QuestionOption<ScanningGoal>[] =
  [
    {
      value:
        "capture-geometry",
      label:
        "Capturar a geometria da peça",
    },

    {
      value:
        "cad-comparison",
      label:
        "Comparar com um modelo CAD",
    },

    {
      value:
        "surface-analysis",
      label:
        "Analisar forma ou superfície",
    },

    {
      value:
        "digital-model",
      label:
        "Criar um modelo digital 3D",
    },

    {
      value:
        "reverse-engineering",
      label:
        "Usar em engenharia reversa",
    },

    {
      value:
        "3d-print",
      label:
        "Usar em impressão 3D",
    },

    {
      value: "other",
      label: "Outro",
    },

    {
      value: "unknown",
      label:
        "Não sei exatamente",
    },
  ];

export const detailLevelOptions: QuestionOption<DetailLevel>[] =
  [
    {
      value: "general",
      label:
        "Forma geral da peça",
    },

    {
      value:
        "visible-details",
      label:
        "Detalhes visíveis",
    },

    {
      value:
        "fine-details",
      label:
        "Pequenos furos, ranhuras ou detalhes",
    },

    {
      value:
        "maximum-fidelity",
      label:
        "Maior fidelidade possível",
    },

    {
      value: "unknown",
      label:
        "Não sei",
    },
  ];

export const surfaceOptions: QuestionOption<SurfaceType>[] =
  [
    {
      value: "opaque",
      label:
        "Fosca / opaca",
    },

    {
      value:
        "reflective",
      label:
        "Brilhante / polida",
    },

    {
      value: "dark",
      label:
        "Muito escura",
    },

    {
      value:
        "transparent",
      label:
        "Transparente",
    },

    {
      value: "mixed",
      label:
        "Possui diferentes acabamentos",
    },

    {
      value: "unknown",
      label:
        "Não sei",
    },
  ];

export const accessLevelOptions: QuestionOption<AccessLevel>[] =
  [
    {
      value: "full",
      label:
        "É possível acessar a peça por vários lados",
    },

    {
      value: "partial",
      label:
        "O acesso é parcial",
    },

    {
      value: "difficult",
      label:
        "O acesso é difícil ou limitado",
    },

    {
      value: "unknown",
      label:
        "Não sei",
    },
  ];

/*
 * ENGENHARIA REVERSA
 */

export const reverseEngineeringGoalOptions: QuestionOption<ReverseEngineeringGoal>[] =
  [
    {
      value:
        "cad-model",
      label:
        "Criar um modelo CAD",
    },

    {
      value:
        "full-reconstruction",
      label:
        "Reconstruir toda a peça",
    },

    {
      value:
        "partial-reconstruction",
      label:
        "Reconstruir apenas uma região",
    },

    {
      value:
        "editable-model",
      label:
        "Criar um modelo que possa ser modificado",
    },

    {
      value:
        "manufacturing-file",
      label:
        "Obter arquivo para fabricação",
    },

    {
      value:
        "update-existing-project",
      label:
        "Atualizar um projeto existente",
    },

    {
      value: "other",
      label: "Outro",
    },

    {
      value: "unknown",
      label:
        "Não sei exatamente",
    },
  ];

export const existingModelOptions: QuestionOption<ExistingModelStatus>[] =
  [
    {
      value: "yes",
      label:
        "Sim, existe um modelo",
    },

    {
      value: "no",
      label:
        "Não existe",
    },

    {
      value: "outdated",
      label:
        "Existe, mas está desatualizado",
    },

    {
      value: "unknown",
      label:
        "Não sei",
    },
  ];

export const geometryScopeOptions: QuestionOption<GeometryScope>[] =
  [
    {
      value: "external",
      label:
        "Somente geometria externa",
    },

    {
      value: "internal",
      label:
        "Geometria interna",
    },

    {
      value: "both",
      label:
        "Geometria externa e interna",
    },

    {
      value: "unknown",
      label:
        "Não sei",
    },
  ];

/*
 * CT / ANÁLISE INTERNA
 */

export const ctGoalOptions: QuestionOption<CtGoal>[] =
  [
    {
      value:
        "internal-geometry",
      label:
        "Visualizar geometria interna",
    },

    {
      value: "defects",
      label:
        "Investigar falhas ou defeitos",
    },

    {
      value: "porosity",
      label:
        "Avaliar porosidade",
    },

    {
      value: "assembly",
      label:
        "Analisar um conjunto montado",
    },

    {
      value:
        "internal-position",
      label:
        "Verificar posicionamento interno",
    },

    {
      value:
        "internal-dimensions",
      label:
        "Avaliar dimensões internas",
    },

    {
      value:
        "internal-reconstruction",
      label:
        "Reconstruir geometria interna",
    },

    {
      value: "other",
      label: "Outro",
    },

    {
      value: "unknown",
      label:
        "Não sei exatamente",
    },
  ];