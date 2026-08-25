import type {
  ConfiguratorState,
  PieceConfiguration,
  RefinementQuestion,
} from "../types";

/*
 * ============================================================
 * MOTOR DE REFINAMENTO
 * ============================================================
 *
 * A Etapa 04 não possui um formulário fixo.
 *
 * Este motor procura informações que:
 *
 * 1. ainda não foram definidas;
 * 2. podem alterar a orientação técnica;
 * 3. fazem sentido para os serviços selecionados;
 * 4. valem a pena perguntar ao cliente.
 *
 * A ideia é evitar uma etapa longa e repetitiva.
 * ============================================================
 */

export function buildRefinementQuestions(
  state: ConfiguratorState,
): RefinementQuestion[] {
  const questions =
    state.pieces.flatMap(
      (piece) =>
        buildPieceRefinementQuestions(
          piece,
        ),
    );

  /*
   * Perguntas mais importantes aparecem primeiro.
   *
   * Limitamos a cinco para a etapa continuar curta.
   */
  return questions
    .sort(
      (a, b) =>
        b.priority -
        a.priority,
    )
    .slice(0, 5);
}

/*
 * ============================================================
 * REFINAMENTO POR PEÇA
 * ============================================================
 */

function buildPieceRefinementQuestions(
  piece: PieceConfiguration,
): RefinementQuestion[] {
  const questions: RefinementQuestion[] =
    [];

  /*
   * ========================================================
   * INSPEÇÃO DIMENSIONAL
   * ========================================================
   */

  if (
    piece.services.includes(
      "dimensional",
    )
  ) {
    const requirements =
      piece.requirements.dimensional;

    /*
     * TOLERÂNCIA / PRECISÃO
     *
     * É uma das informações mais relevantes para
     * diferenciar principalmente PRISMO e DuraMax.
     */

    if (
      !requirements.toleranceKnowledge ||
      requirements.toleranceKnowledge ===
        "exists-but-unknown" ||
      requirements.toleranceKnowledge ===
        "unknown"
    ) {
      questions.push({
        id:
          "dimensional-tolerance",

        pieceId:
          piece.id,

        service:
          "dimensional",

        title:
          "Você consegue informar melhor a exigência de precisão desta peça?",

        explanation:
          "A exigência de precisão ajuda a diferenciar tecnologias dimensionais adequadas a verificações gerais de sistemas voltados a características mais críticas.",

        priority: 100,
      });
    }

    /*
     * CONTATO / SEM CONTATO
     *
     * Pode alterar bastante a relevância da O-INSPECT.
     */

    if (
      !requirements.nonContactNeeded ||
      requirements.nonContactNeeded ===
        "unknown" ||
      requirements.nonContactNeeded ===
        "maybe"
    ) {
      questions.push({
        id:
          "dimensional-contact",

        pieceId:
          piece.id,

        service:
          "dimensional",

        title:
          "As características podem ser medidas por contato ou existe alguma região que não deve ser tocada?",

        explanation:
          "Essa informação ajuda a entender se uma estratégia tátil é suficiente ou se uma solução multissensor pode ser mais interessante.",

        priority: 80,
      });
    }
  }

  /*
   * ========================================================
   * DIGITALIZAÇÃO 3D
   * ========================================================
   */

  if (
    piece.services.includes(
      "scan",
    )
  ) {
    const requirements =
      piece.requirements.scanning;

    /*
     * NÍVEL DE DETALHE
     *
     * Muito importante na relação ATOS Q × T-SCAN.
     */

    if (
      !requirements.detailLevel ||
      requirements.detailLevel ===
        "unknown"
    ) {
      questions.push({
        id:
          "scanning-detail",

        pieceId:
          piece.id,

        service:
          "scan",

        title:
          "Qual nível de detalhe realmente precisa ser preservado na digitalização?",

        explanation:
          "Essa informação ajuda a diferenciar uma aquisição voltada principalmente à geometria geral de outra que exige maior fidelidade e pequenos detalhes.",

        priority: 95,
      });
    }

    /*
     * LOCAL / MOBILIDADE
     *
     * Essencial para diferenciar uma solução fixa
     * de uma solução portátil.
     */

    if (
      !piece.location ||
      piece.location ===
        "needs-guidance" ||
      piece.location ===
        "unknown"
    ) {
      questions.push({
        id:
          "scanning-location",

        pieceId:
          piece.id,

        service:
          "scan",

        title:
          "A peça poderá ser levada ao Centro ou precisa ser digitalizada onde está?",

        explanation:
          "A necessidade de mobilidade é um dos fatores importantes para diferenciar as estratégias de digitalização disponíveis.",

        priority: 100,
      });
    }
  }

  /*
   * ========================================================
   * ENGENHARIA REVERSA
   * ========================================================
   */

  if (
    piece.services.includes(
      "reverse-engineering",
    )
  ) {
    const requirements =
      piece.requirements
        .reverseEngineering;

    /*
     * ESCOPO DA GEOMETRIA
     *
     * Define se a aquisição pode ser externa,
     * interna ou combinar diferentes tecnologias.
     */

    if (
      !requirements.geometryScope ||
      requirements.geometryScope ===
        "unknown"
    ) {
      questions.push({
        id:
          "reverse-geometry-scope",

        pieceId:
          piece.id,

        service:
          "reverse-engineering",

        title:
          "A reconstrução precisa considerar apenas a geometria externa ou também regiões internas?",

        explanation:
          "Essa resposta ajuda a definir quais métodos de aquisição devem fornecer as informações necessárias para o processo de engenharia reversa.",

        priority: 100,
      });
    }
  }

  /*
   * ========================================================
   * CT / ANÁLISE INTERNA
   * ========================================================
   */

  if (
    piece.services.includes(
      "internal",
    )
  ) {
    const requirements =
      piece.requirements.ct;

    /*
     * REGIÃO DE INTERESSE
     */

    if (
      !requirements.region ||
      requirements.region ===
        "unknown"
    ) {
      questions.push({
        id:
          "ct-region",

        pieceId:
          piece.id,

        service:
          "internal",

        title:
          "Você precisa analisar a peça inteira, uma região específica ou um conjunto montado?",

        explanation:
          "A região de interesse ajuda a equipe a compreender melhor o objetivo da análise interna e a estratégia necessária.",

        priority: 90,
      });
    }
  }

  return questions;
}

/*
 * ============================================================
 * CONSULTAS AUXILIARES
 * ============================================================
 */

export function hasUsefulRefinementQuestions(
  state: ConfiguratorState,
): boolean {
  return (
    buildRefinementQuestions(
      state,
    ).length > 0
  );
}

export function getRefinementQuestionCount(
  state: ConfiguratorState,
): number {
  return buildRefinementQuestions(
    state,
  ).length;
}