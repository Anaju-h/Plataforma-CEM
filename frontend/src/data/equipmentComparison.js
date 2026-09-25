/*
 * ============================================================
 * COMPARADOR DE EQUIPAMENTOS — LINHAS COMPARÁVEIS
 * ============================================================
 *
 * As fichas dos fabricantes medem grandezas diferentes (erro de
 * comprimento, distância entre pontos, tensão do tubo…), então não
 * são comparáveis lado a lado. Aqui cada máquina responde às MESMAS
 * perguntas, com respostas objetivas tiradas das fichas técnicas
 * (equipmentSpecs.js) e do princípio de medição de cada tecnologia.
 * Não há notas ou pontuações: nada que pareça medição oficial.
 * ============================================================
 */

export const COMPARISON_ROWS = [
  { key: "principle", label: "Princípio de medição" },
  { key: "contact", label: "Encosta na peça?" },
  { key: "internal", label: "Vê o interior da peça?" },
  { key: "location", label: "Onde o serviço acontece" },
  { key: "partSize", label: "Tamanho de peça" },
  { key: "detail", label: "Nível de detalhe" },
  { key: "output", label: "O que você recebe" },
  { key: "bestFor", label: "Indicada para" },
];

export const equipmentComparison = {
  prismo: {
    principle: "Tátil (apalpador)",
    contact: "Sim",
    internal: "Não",
    location: "No Centro",
    partSize: "Volume a partir de 700 × 900 × 500 mm",
    detail: "Micrômetros (µm)",
    output: "Relatório dimensional e geométrico (GD&T)",
    bestFor: "Tolerâncias apertadas e geometrias complexas",
  },
  duramax: {
    principle: "Tátil (apalpador)",
    contact: "Sim",
    internal: "Não",
    location: "No Centro",
    partSize: "Volume de 500 × 500 × 500 mm",
    detail: "Micrômetros (µm)",
    output: "Relatório dimensional e geométrico (GD&T)",
    bestFor: "Controle dimensional de peças pequenas e médias",
  },
  "o-inspect": {
    principle: "Multissensor: óptico e tátil",
    contact: "Opcional (óptico sem contato ou tátil)",
    internal: "Não",
    location: "No Centro",
    partSize: "Volume de 300 × 200 × 200 a 500 × 400 × 300 mm",
    detail: "Micrômetros (µm)",
    output: "Relatório dimensional e geométrico (GD&T)",
    bestFor: "Peças pequenas, detalhes finos e superfícies delicadas",
  },
  "atos-q": {
    principle: "Óptico (projeção de luz)",
    contact: "Não",
    internal: "Não",
    location: "No Centro",
    partSize: "Campo de 100 × 70 a 500 × 370 mm por captura",
    detail: "Centésimos de milímetro",
    output: "Malha 3D (STL), comparação com o CAD e mapa de desvios",
    bestFor: "Digitalização detalhada e comparação peça × CAD",
  },
  "t-scan": {
    principle: "Óptico (laser azul, manual)",
    contact: "Não",
    internal: "Não",
    location: "No Centro ou na empresa (portátil)",
    partSize: "Peças médias a muito grandes",
    detail: "Centésimos de milímetro",
    output: "Malha 3D (STL), comparação com o CAD e mapa de desvios",
    bestFor: "Peças grandes ou que não podem sair do lugar",
  },
  "bosello-max": {
    principle: "Raios X",
    contact: "Não",
    internal: "Sim",
    location: "No Centro",
    partSize: "Até Ø 1000 × 1500 mm e 200 kg",
    detail: "Detecção de falhas internas",
    output: "Imagens de raios X do interior da peça",
    bestFor: "Porosidades, trincas e montagens sem desmontar",
  },
};

export const COMPARABLE_IDS = Object.keys(equipmentComparison);
export const DEFAULT_COMPARISON = ["prismo", "atos-q", "bosello-max"];
export const MAX_COMPARED = 3;
export const MIN_COMPARED = 2;

/** Lê "?comparar=a,b,c" e devolve só ids válidos, sem repetição, até o máximo. */
export function parseComparison(value) {
  const ids = [...new Set(String(value ?? "").split(",").map(id => id.trim()).filter(id => COMPARABLE_IDS.includes(id)))].slice(0, MAX_COMPARED);
  return ids.length >= MIN_COMPARED ? ids : DEFAULT_COMPARISON;
}
