export const requestNeeds = [
  {
    id: "check-piece",
    number: "01",
    name: "Metrologia e inspeção dimensional",
    title: "Quero conferir medidas, geometria ou tolerâncias",
    description:
      "Verificar conformidade dimensional, geométrica ou requisitos em relação a desenho, CAD ou especificação.",
    tag: "Metrologia e inspeção",
    flow: "configurator",
    services: ["dimensional"],
  },

  {
    id: "physical-to-3d",
    number: "02",
    name: "Escaneamento e digitalização 3D",
    title: "Quero escanear ou digitalizar uma peça em 3D",
    description:
      "Capturar digitalmente a geometria para análise, documentação, comparação ou outras aplicações digitais.",
    tag: "Escaneamento 3D",
    flow: "configurator",
    services: ["scan"],
  },

  {
    id: "reproduce-piece",
    number: "03",
    name: "Engenharia reversa, desenvolvimento ou nacionalização",
    title: "Preciso reconstruir, desenvolver ou nacionalizar um componente",
    description:
      "Criar ou atualizar um modelo CAD a partir da peça física para documentação, desenvolvimento ou fabricação.",
    tag: "Engenharia reversa",
    flow: "configurator",
    services: ["reverse-engineering"],
  },

  {
    id: "compare-cad",
    number: "04",
    name: "Comparação entre peça física e CAD",
    title: "Quero comparar a peça real com um arquivo CAD",
    description:
      "Avaliar diferenças entre a geometria física do componente e o modelo digital de referência.",
    tag: "Comparação CAD × peça",
    flow: "configurator",
    services: ["scan"],
  },

  {
    id: "inside",
    number: "05",
    name: "Tomografia industrial e inspeção interna",
    title: "Preciso investigar o interior da peça",
    description:
      "Analisar regiões internas, montagens, porosidades, defeitos ou características que não podem ser acessadas externamente.",
    tag: "Tomografia industrial",
    flow: "configurator",
    services: ["internal"],
  },

  {
    id: "failure-analysis",
    number: "06",
    name: "Análise de falhas, quebras, anomalias ou desgaste",
    title: "Preciso investigar uma falha, quebra, anomalia ou desgaste",
    description:
      "Direcionar uma análise técnica que pode combinar diferentes recursos conforme o problema encontrado.",
    tag: "Análise e confiabilidade",
    flow: "direct-request",
    services: ["failure-analysis"],
  },

  {
    id: "asset-structure",
    number: "07",
    name: "Gestão técnica de ativos e peças críticas",
    title: "Quero estruturar equipamentos ou identificar peças críticas",
    description:
      "Organizar árvores de equipamentos, componentes e informações relevantes para gestão técnica dos ativos.",
    tag: "Gestão técnica de ativos",
    flow: "direct-request",
    services: ["asset-structure"],
  },

  {
    id: "digital-library",
    number: "08",
    name: "Biblioteca digital e almoxarifado virtual",
    title: "Quero criar uma biblioteca digital ou almoxarifado virtual",
    description:
      "Estruturar informações e representações digitais de componentes para consulta, documentação e reutilização.",
    tag: "Gestão digital de componentes",
    flow: "direct-request",
    services: ["digital-library"],
  },

  {
    id: "maintenance",
    number: "09",
    name: "Planos de manutenção e lubrificação",
    title: "Preciso elaborar um plano de manutenção ou lubrificação",
    description:
      "Solicitar apoio técnico na estruturação de planos voltados à manutenção e confiabilidade dos ativos.",
    tag: "Manutenção e confiabilidade",
    flow: "direct-request",
    services: ["maintenance"],
  },

  {
    id: "training",
    number: "10",
    name: "Treinamento técnico",
    title: "Estou procurando treinamento técnico",
    description:
      "Treinamentos nas áreas de manutenção, metrologia, engenharia reversa, lubrificação e análise de falhas.",
    tag: "Capacitação técnica",
    flow: "direct-request",
    services: ["training"],
  },
];

export const technicalRequestNeeds = requestNeeds.filter(
  (need) => need.flow === "configurator",
);

export const directRequestNeeds = requestNeeds.filter(
  (need) => need.flow === "direct-request",
);

export function getRequestNeed(needId) {
  return (
    requestNeeds.find(
      (need) => need.id === needId,
    ) ?? null
  );
}

export function getRequestNeedServices(needId) {
  return (
    getRequestNeed(needId)?.services ??
    []
  );
}