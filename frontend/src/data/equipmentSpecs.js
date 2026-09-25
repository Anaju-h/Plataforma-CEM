/*
 * ============================================================
 * DADOS TÉCNICOS DOS EQUIPAMENTOS
 * ============================================================
 *
 * Fonte: fichas técnicas públicas da ZEISS (configuração base
 * de cada linha). Os valores variam conforme tamanho, sensores
 * e opcionais instalados; confirme a configuração do Centro
 * antes de usar em especificação contratual.
 *
 * `key` identifica o dado mais relevante para comparação rápida
 * (usado em cards compactos e no resumo do configurador).
 * ============================================================
 */

export const EQUIPMENT_SPECS_NOTE =
  "Dados do fabricante para a configuração base; os valores variam conforme tamanho e sensores.";

export const equipmentSpecs = {
  prismo: {
    key: { label: "Erro de comprimento (MPE_E0)", value: "a partir de 0,9 + L/350 µm" },
    specs: [
      { label: "Erro de comprimento (MPE_E0)", value: "a partir de 0,9 + L/350 µm" },
      { label: "Erro de scanning (MPE_THP)", value: "a partir de 1,3 µm" },
      { label: "Volume de medição", value: "a partir de 700 × 900 × 500 mm" },
      { label: "Velocidade vetorial", value: "até 520 mm/s" },
    ],
  },
  "o-inspect": {
    key: { label: "Erro de comprimento (E0)", value: "a partir de 1,6 µm" },
    specs: [
      { label: "Erro de comprimento (E0)", value: "a partir de 1,6 µm" },
      { label: "Volume de medição", value: "300 × 200 × 200 mm a 500 × 400 × 300 mm" },
      { label: "Sensores", value: "Óptico (câmera) e tátil" },
      { label: "Indicado para", value: "Peças pequenas e detalhes finos" },
    ],
  },
  duramax: {
    key: { label: "Erro de comprimento (MPE_E)", value: "2,4 + L/300 µm" },
    specs: [
      { label: "Erro de comprimento (MPE_E)", value: "2,4 + L/300 µm (18–22 °C)" },
      { label: "Erro de apalpação (MPE_P)", value: "2,4 µm" },
      { label: "Volume de medição", value: "500 × 500 × 500 mm" },
      { label: "Scanning", value: "até 500 pontos/s" },
    ],
  },
  "t-scan": {
    key: { label: "Precisão volumétrica", value: "0,02 mm + 0,015 mm/m" },
    specs: [
      { label: "Precisão volumétrica", value: "0,02 mm + 0,015 mm/m" },
      { label: "Tecnologia", value: "Laser azul (cruzes e linha única)" },
      { label: "Peso do scanner", value: "< 1 kg" },
      { label: "Uso", value: "Portátil, em campo ou no Centro" },
    ],
  },
  "atos-q": {
    key: { label: "Distância entre pontos", value: "0,03 a 0,15 mm" },
    specs: [
      { label: "Distância entre pontos", value: "0,03 a 0,15 mm" },
      { label: "Área de medição", value: "100 × 70 a 500 × 370 mm²" },
      { label: "Pontos por captura", value: "8 ou 12 milhões" },
      { label: "Distância de trabalho", value: "490 mm" },
    ],
  },
  "bosello-max": {
    key: { label: "Tensão do tubo", value: "160 a 450 kV" },
    specs: [
      { label: "Tensão do tubo", value: "160 a 450 kV (conforme modelo)" },
      { label: "Detector", value: "Painel plano, pixel de 100 a 400 µm" },
      { label: "Peça máxima", value: "até Ø 1000 × 1500 mm e 200 kg" },
      { label: "Inspeção", value: "Raios X 2D, preparado para CT" },
    ],
  },
};

export function getEquipmentSpecs(id) {
  return equipmentSpecs[id] ?? null;
}

const EQUIPMENT_IDS_BY_NAME = {
  "ZEISS PRISMO": "prismo",
  "ZEISS O-INSPECT": "o-inspect",
  "ZEISS DuraMax": "duramax",
  "ZEISS T-SCAN": "t-scan",
  "ZEISS ATOS Q": "atos-q",
  "ZEISS BOSELLO MAX": "bosello-max",
};

// Dado-chave de um equipamento a partir do nome exibido (ex.: listas de tecnologias em Serviços).
export function getKeySpecByName(name) {
  const id = EQUIPMENT_IDS_BY_NAME[name];
  return id ? equipmentSpecs[id].key : null;
}
