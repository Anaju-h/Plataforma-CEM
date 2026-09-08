/*
 * ============================================================
 * CONHECIMENTO DE PRECIFICAÇÃO
 * ============================================================
 *
 * IMPORTANTE:
 *
 * Nenhum valor abaixo representa preço obrigatório.
 *
 * Existem três conceitos diferentes:
 *
 * 1. custo técnico de referência;
 * 2. referência comercial vigente;
 * 3. valor efetivamente definido pelo responsável.
 *
 * Quando existir backend, estes dados serão administráveis
 * pelo Portal e deixarão de ficar no código.
 * ============================================================
 */

/*
 * ============================================================
 * REFERÊNCIA COMERCIAL
 * ============================================================
 *
 * Valor atualmente praticado como referência pelo laboratório.
 *
 * NÃO é tabela fixa.
 * NÃO é valor obrigatório.
 * NÃO substitui decisão humana.
 */

export const initialCommercialReference = {
  hourlyRate: 150,

  currency: "BRL",

  status: "active",

  label:
    "Referência comercial vigente",

  description:
    "Valor/hora utilizado atualmente como referência comercial pelo laboratório.",

  source:
    "Prática comercial atual do laboratório",

  /*
   * Depois isso será uma data real
   * cadastrada no banco.
   */
  updatedAt:
    "26/08/2026",
};

/*
 * ============================================================
 * BASE HISTÓRICA / PLANILHA DE CUSTOS
 * ============================================================
 *
 * Estes valores vieram da planilha interna de custos.
 *
 * Eles são conhecimento para apoio à decisão.
 *
 * NÃO representam preço de venda.
 * NÃO devem ser enviados ao cliente.
 */

export const machineCostKnowledge = {
  duramax: {
    id: "duramax",

    name:
      "ZEISS DuraMax",

    spreadsheetName:
      "CMM DuraMax",

    costWithoutLabor:
      21.1,

    costWithLabor:
      105.25,

    costWithAdministrative:
      173.67,

    source:
      "Folha de custos por máquina",

    sourceType:
      "internal-spreadsheet",
  },

  "o-inspect": {
    id: "o-inspect",

    name:
      "ZEISS O-INSPECT",

    spreadsheetName:
      "CMM O-INSPECT",

    costWithoutLabor:
      37.94,

    costWithLabor:
      122.09,

    costWithAdministrative:
      201.44,

    source:
      "Folha de custos por máquina",

    sourceType:
      "internal-spreadsheet",
  },

  prismo: {
    id: "prismo",

    name:
      "ZEISS PRISMO",

    spreadsheetName:
      "CMM PRISMO",

    costWithoutLabor:
      104.93,

    costWithLabor:
      189.08,

    costWithAdministrative:
      311.98,

    source:
      "Folha de custos por máquina",

    sourceType:
      "internal-spreadsheet",
  },

  "bosello-max": {
    id: "bosello-max",

    name:
      "ZEISS BOSELLO MAX",

    spreadsheetName:
      "BOSELLO MAX 80",

    costWithoutLabor:
      81.79,

    costWithLabor:
      165.94,

    costWithAdministrative:
      273.81,

    source:
      "Folha de custos por máquina",

    sourceType:
      "internal-spreadsheet",
  },

  "atos-q": {
    id: "atos-q",

    name:
      "ZEISS ATOS Q",

    spreadsheetName:
      "ATOS Q 8M",

    costWithoutLabor:
      23.22,

    costWithLabor:
      107.37,

    costWithAdministrative:
      177.16,

    source:
      "Folha de custos por máquina",

    sourceType:
      "internal-spreadsheet",
  },

  contura: {
    id: "contura",

    name:
      "ZEISS CONTURA",

    spreadsheetName:
      "CONTURA",

    costWithoutLabor:
      35.02,

    costWithLabor:
      119.17,

    costWithAdministrative:
      196.62,

    source:
      "Folha de custos por máquina",

    sourceType:
      "internal-spreadsheet",
  },
};

export function getMachineCostKnowledge(
  machineId,
) {
  return (
    machineCostKnowledge[
      machineId
    ] ?? null
  );
}

export function getAllMachineCostKnowledge() {
  return Object.values(
    machineCostKnowledge,
  );
}