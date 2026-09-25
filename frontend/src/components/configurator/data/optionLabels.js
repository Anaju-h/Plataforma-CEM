// Rótulos das opções do Configurador (extraídos das etapas) para o resumo técnico enviado à área interna.
export const OPTION_LABELS = {
  "PieceStep.typeOptions": {
    "component": "Componente",
    "assembly": "Conjunto",
    "structure": "Estrutura",
    "other": "Outro",
    "unknown": "Não sei"
  },
  "PieceStep.materialOptions": {
    "steel": "Aço",
    "aluminum": "Alumínio",
    "other-metal": "Outro metal",
    "polymer": "Polímero",
    "composite": "Compósito",
    "ceramic": "Cerâmica",
    "other": "Outro",
    "unknown": "Não sei"
  },
  "PieceStep.sizeOptions": {
    "hand": "Cabe na mão",
    "table": "Cabe sobre uma mesa",
    "large": "Peça grande",
    "structure": "Estrutura / grande porte",
    "unknown": "Não sei"
  },
  "PieceStep.locationOptions": {
    "laboratory": "Pode ir ao laboratório",
    "customer-site": "Precisa ser analisada no local",
    "installed": "Está instalada",
    "needs-guidance": "Preciso de orientação",
    "unknown": "Não sei"
  },
  "DimensionalRequirements.goals": {
    "dimensions": "Dimensões da peça",
    "tolerances": "Tolerâncias",
    "geometry": "Geometria e forma",
    "comparison": "Comparação com especificação",
    "other": "Outro objetivo",
    "unknown": "Ainda não sei"
  },
  "DimensionalRequirements.toleranceOptions": {
    "exact": "Conheço o valor",
    "high-precision": "Exige alta precisão",
    "exists-but-unknown": "Existem tolerâncias, mas não conheço os valores",
    "not-critical": "Não existem tolerâncias críticas",
    "unknown": "Não sei"
  },
  "DimensionalRequirements.smallFeatureOptions": {
    "yes": "Sim",
    "no": "Não",
    "unknown": "Não sei"
  },
  "DimensionalRequirements.referenceOptions": {
    "yes": "Sim",
    "no": "Não",
    "unknown": "Não sei"
  },
  "ScanningRequirements.goals": {
    "capture-geometry": "Capturar a geometria da peça",
    "cad-comparison": "Comparar a peça com um modelo CAD",
    "surface-analysis": "Analisar forma ou superfície",
    "digital-model": "Criar um modelo digital 3D",
    "reverse-engineering": "Usar a digitalização em engenharia reversa",
    "3d-print": "Usar em impressão 3D",
    "other": "Outro objetivo",
    "unknown": "Ainda não sei"
  },
  "ScanningRequirements.detailOptions": {
    "general": "Forma geral da peça",
    "visible-details": "Detalhes visíveis",
    "fine-details": "Pequenos furos, ranhuras ou detalhes",
    "maximum-fidelity": "Maior fidelidade possível",
    "unknown": "Não sei"
  },
  "ScanningRequirements.surfaceOptions": {
    "opaque": "Fosca / opaca",
    "reflective": "Brilhante / polida",
    "dark": "Muito escura",
    "transparent": "Transparente",
    "mixed": "Diferentes acabamentos",
    "unknown": "Não sei"
  },
  "ScanningRequirements.accessOptions": {
    "full": "Acesso completo",
    "partial": "Acesso parcial",
    "difficult": "Acesso difícil ou limitado",
    "unknown": "Não sei"
  },
  "ReverseEngineeringRequirements.goals": {
    "cad-model": "Gerar um modelo CAD",
    "full-reconstruction": "Reconstrução completa",
    "partial-reconstruction": "Reconstrução parcial",
    "editable-model": "Criar um modelo editável",
    "manufacturing-file": "Gerar arquivo para fabricação",
    "update-existing-project": "Atualizar um projeto existente",
    "other": "Outro objetivo",
    "unknown": "Ainda não sei"
  },
  "ReverseEngineeringRequirements.existingModelOptions": {
    "yes": "Sim, existe um modelo",
    "no": "Não existe",
    "outdated": "Existe, mas está desatualizado",
    "unknown": "Não sei"
  },
  "ReverseEngineeringRequirements.geometryScopeOptions": {
    "external": "Somente geometria externa",
    "internal": "Geometrias internas",
    "both": "Geometrias externas e internas",
    "unknown": "Não sei"
  },
  "ReverseEngineeringRequirements.modificationOptions": {
    "yes": "Sim",
    "no": "Não",
    "unknown": "Não sei"
  },
  "CtRequirements.goals": {
    "internal-geometry": "Visualizar geometrias internas",
    "defects": "Identificar defeitos internos",
    "porosity": "Analisar porosidade",
    "assembly": "Avaliar um conjunto montado",
    "internal-position": "Verificar posição interna",
    "internal-dimensions": "Medir características internas",
    "internal-reconstruction": "Reconstruir a geometria interna",
    "other": "Outro objetivo",
    "unknown": "Ainda não sei"
  },
  "CtRequirements.regionOptions": {
    "whole-piece": "Peça completa",
    "specific-region": "Região específica",
    "assembled-set": "Conjunto montado",
    "unknown": "Não sei"
  },
  "CtRequirements.disassemblyOptions": {
    "yes": "Sim",
    "no": "Não",
    "unknown": "Não sei"
  },
  "CtRequirements.intactOptions": {
    "yes": "Sim",
    "no": "Não necessariamente",
    "unknown": "Não sei"
  }
};
