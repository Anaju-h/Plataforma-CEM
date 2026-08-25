import {
  getCandidateMachines,
} from "../data/serviceCatalog";

import {
  machineProfiles,
} from "../data/machineProfiles";

import type {
  ConfiguratorState,
  ConfiguratorStep,
  MachineId,
  MachineMatch,
  MatchLevel,
  PieceConfiguration,
  PieceRecommendation,
  ProjectRecommendation,
  ServiceId,
  ServiceRecommendation,
} from "../types";

/*
 * ============================================================
 * ESTRUTURAS INTERNAS
 * ============================================================
 */

type ScoreAccumulator = {
  score: number;

  reasons: string[];

  warnings: string[];

  missingInformation: string[];
};

/*
 * Não começamos em zero porque uma máquina que pertence
 * àquela família já possui relação com o serviço.
 */
function createAccumulator(
  initialScore = 40,
): ScoreAccumulator {
  return {
    score: initialScore,

    reasons: [],

    warnings: [],

    missingInformation: [],
  };
}

/*
 * ============================================================
 * UTILITÁRIOS
 * ============================================================
 */

function unique<T>(
  values: T[],
): T[] {
  return Array.from(
    new Set(values),
  );
}

function clampScore(
  score: number,
): number {
  return Math.max(
    0,
    Math.min(100, score),
  );
}

function matchLevelFromScore(
  score: number,
): MatchLevel {
  if (score >= 80) {
    return "high";
  }

  if (score >= 60) {
    return "good";
  }

  if (score >= 40) {
    return "possible";
  }

  if (score > 0) {
    return "low";
  }

  return "review";
}

function addReason(
  target: ScoreAccumulator,
  text: string,
) {
  if (
    !target.reasons.includes(text)
  ) {
    target.reasons.push(text);
  }
}

function addWarning(
  target: ScoreAccumulator,
  text: string,
) {
  if (
    !target.warnings.includes(text)
  ) {
    target.warnings.push(text);
  }
}

function addMissingInformation(
  target: ScoreAccumulator,
  text: string,
) {
  if (
    !target.missingInformation.includes(text)
  ) {
    target.missingInformation.push(text);
  }
}

function hasExactDimensions(
  piece: PieceConfiguration,
): boolean {
  return Boolean(
    piece.dimensions.length &&
      piece.dimensions.width &&
      piece.dimensions.height,
  );
}

function getLargestDimension(
  piece: PieceConfiguration,
): number | null {
  if (!hasExactDimensions(piece)) {
    return null;
  }

  const values = [
    Number(piece.dimensions.length),
    Number(piece.dimensions.width),
    Number(piece.dimensions.height),
  ].filter(
    (value) =>
      Number.isFinite(value) &&
      value > 0,
  );

  if (values.length !== 3) {
    return null;
  }

  return Math.max(...values);
}

/*
 * ============================================================
 * CANDIDATAS — ETAPA 01
 * ============================================================
 *
 * Aqui NÃO existe recomendação.
 *
 * Todas as tecnologias relacionadas aparecem em igualdade
 * como "candidate".
 */

function buildCandidateMatches(
  services: ServiceId[],
): MachineMatch[] {
  return getCandidateMachines(
    services,
  ).map(
    (machineId) => ({
      machineId,

      score: 0,

      level: "candidate",

      reasons: [
        "Tecnologia relacionada aos serviços selecionados para o projeto.",
      ],

      warnings: [],

      missingInformation: [
        "Características da peça",
        "Requisitos técnicos da aplicação",
      ],
    }),
  );
}

/*
 * ============================================================
 * CONTEXTO GERAL DA PEÇA
 * ============================================================
 *
 * Essa lógica começa a atuar já na Etapa 02.
 */

function applyPieceContext(
  piece: PieceConfiguration,
  machineId: MachineId,
  target: ScoreAccumulator,
) {
  const profile =
    machineProfiles[machineId];

  /*
   * PEÇA PEQUENA
   */

  if (
    piece.sizeCategory === "hand" ||
    piece.sizeCategory === "table"
  ) {
    const smallStrength =
      profile.strengths.smallParts ??
      0;

    target.score +=
      smallStrength * 3;

    if (smallStrength >= 4) {
      addReason(
        target,
        "O porte informado da peça favorece esta tecnologia.",
      );
    }
  }

  /*
   * PEÇA GRANDE / ESTRUTURA
   */

  if (
    piece.sizeCategory === "large" ||
    piece.sizeCategory === "structure"
  ) {
    const largeStrength =
      profile.strengths.largeParts ??
      0;

    target.score +=
      largeStrength * 4;

    if (largeStrength >= 4) {
      addReason(
        target,
        "O porte ou tipo estrutural do componente favorece esta tecnologia.",
      );
    }

    /*
     * Penalizamos tecnologias cujo perfil atual é
     * claramente voltado a peças menores.
     *
     * Isso NÃO é uma exclusão por capacidade real.
     */
    if (
      (profile.strengths.smallParts ?? 0) >= 5 &&
      largeStrength <= 2
    ) {
      target.score -= 12;

      addWarning(
        target,
        "O porte informado pode tornar esta tecnologia menos adequada; a capacidade real do equipamento deverá ser validada.",
      );
    }
  }

  /*
   * LOCAL / MOBILIDADE
   */

  if (
    piece.location === "customer-site" ||
    piece.location === "installed"
  ) {
    if (profile.mobile) {
      target.score += 25;

      addReason(
        target,
        "A aplicação exige mobilidade ou aquisição fora do laboratório.",
      );
    } else if (
      machineId === "atos-q"
    ) {
      target.score -= 25;

      addWarning(
        target,
        "O ATOS Q é uma solução fixa e a aplicação informada exige mobilidade.",
      );
    }
  }

  if (
    piece.location === "laboratory" &&
    !profile.mobile
  ) {
    target.score += 5;
  }

  /*
   * ESTRUTURA
   */

  if (
    piece.type === "structure" &&
    profile.mobile
  ) {
    target.score += 15;

    addReason(
      target,
      "A peça foi identificada como estrutura, favorecendo uma solução com liberdade de movimentação.",
    );
  }

  /*
   * DIMENSÕES EXATAS
   *
   * Por enquanto NÃO usamos limites absolutos.
   */

  const largestDimension =
    getLargestDimension(piece);

  if (
    largestDimension !== null &&
    !profile.capacity
  ) {
    if (
      largestDimension >= 1000 &&
      (profile.strengths.largeParts ?? 0) <= 2
    ) {
      addWarning(
        target,
        "As dimensões informadas exigem validação do volume útil deste equipamento.",
      );
    }
  }

  /*
   * INFORMAÇÕES AINDA AUSENTES
   */

  if (
    !piece.sizeCategory &&
    !hasExactDimensions(piece)
  ) {
    addMissingInformation(
      target,
      "Porte ou dimensões da peça",
    );
  }

  if (!piece.location) {
    addMissingInformation(
      target,
      "Local e condição de atendimento",
    );
  }
}

/*
 * ============================================================
 * INSPEÇÃO DIMENSIONAL
 * ============================================================
 *
 * Família:
 *
 * PRISMO
 * DuraMax
 * O-INSPECT
 */

function evaluateDimensional(
  piece: PieceConfiguration,
  currentStep: ConfiguratorStep,
): MachineMatch[] {
  const machineIds: MachineId[] = [
    "prismo",
    "duramax",
    "o-inspect",
  ];

  const scores: Record<
    MachineId,
    ScoreAccumulator
  > = {
    prismo: createAccumulator(),

    duramax: createAccumulator(),

    "o-inspect":
      createAccumulator(),

    "atos-q":
      createAccumulator(0),

    "t-scan":
      createAccumulator(0),

    "bosello-max":
      createAccumulator(0),
  };

  /*
   * ETAPA 02 EM DIANTE:
   * já podemos avaliar características físicas.
   */

  for (const id of machineIds) {
    applyPieceContext(
      piece,
      id,
      scores[id],
    );

    addReason(
      scores[id],
      "Tecnologia relacionada à inspeção dimensional.",
    );
  }

  /*
   * Antes da Etapa 03 não usamos respostas técnicas.
   */

  if (currentStep >= 3) {
    const requirements =
      piece.requirements.dimensional;

    /*
     * PRECISÃO / TOLERÂNCIA
     */

    if (
      requirements.toleranceKnowledge ===
      "exact"
    ) {
      const tolerance =
        Number(
          requirements.criticalToleranceMm,
        );

      if (
        Number.isFinite(tolerance) &&
        tolerance > 0
      ) {
        /*
         * Estes cortes são inicialmente orientadores,
         * não especificações oficiais das máquinas.
         *
         * Serão calibrados posteriormente com os dados
         * reais e a experiência do laboratório.
         */

        if (tolerance <= 0.01) {
          scores.prismo.score += 30;

          addReason(
            scores.prismo,
            "A tolerância informada indica elevada exigência de precisão.",
          );

          scores.duramax.score -= 10;

          addWarning(
            scores.duramax,
            "A exigência de precisão informada favorece uma tecnologia dimensional de maior desempenho.",
          );
        } else if (
          tolerance <= 0.05
        ) {
          scores.prismo.score += 15;

          scores.duramax.score += 8;
        } else {
          scores.duramax.score += 12;

          addReason(
            scores.duramax,
            "A aplicação dimensional informada não indica, até o momento, exigência extrema de precisão.",
          );
        }
      } else {
        addMissingInformation(
          scores.prismo,
          "Valor válido da tolerância crítica",
        );
      }
    }

    if (
      requirements.toleranceKnowledge ===
      "high-precision"
    ) {
      scores.prismo.score += 25;

      addReason(
        scores.prismo,
        "O usuário indicou que a aplicação possui alta exigência de precisão.",
      );
    }

    if (
      requirements.toleranceKnowledge ===
      "not-critical"
    ) {
      scores.duramax.score += 15;

      addReason(
        scores.duramax,
        "A aplicação foi indicada como uma conferência dimensional sem exigência extrema de precisão.",
      );
    }

    /*
     * OBJETIVOS
     */

    const goals =
      requirements.goals;

    if (
      goals.includes("geometry") ||
      goals.includes("position") ||
      goals.includes("tolerances")
    ) {
      scores.prismo.score += 15;

      addReason(
        scores.prismo,
        "A aplicação envolve características geométricas, posicionais ou tolerâncias.",
      );
    }

    if (
      goals.includes(
        "general-dimensions",
      ) ||
      goals.includes(
        "quality-control",
      )
    ) {
      scores.duramax.score += 10;

      addReason(
        scores.duramax,
        "A aplicação inclui controle dimensional ou verificação de medidas gerais.",
      );
    }

    /*
     * NECESSIDADE SEM CONTATO
     */

    if (
      requirements.nonContactNeeded ===
      "yes"
    ) {
      scores["o-inspect"].score += 30;

      addReason(
        scores["o-inspect"],
        "Existem características que precisam ser avaliadas sem contato.",
      );

      scores.prismo.score -= 5;

      scores.duramax.score -= 5;
    }

    if (
      requirements.nonContactNeeded ===
      "no"
    ) {
      scores.prismo.score += 5;

      scores.duramax.score += 8;
    }

    /*
     * PEQUENAS CARACTERÍSTICAS
     */

    if (
      requirements.smallFeatures ===
      "yes"
    ) {
      scores["o-inspect"].score += 20;

      addReason(
        scores["o-inspect"],
        "A peça possui pequenas características que podem favorecer uma estratégia multissensor.",
      );
    }

    /*
     * AUSÊNCIA DE INFORMAÇÕES IMPORTANTES
     */

    if (
      !requirements.toleranceKnowledge
    ) {
      for (const id of machineIds) {
        addMissingInformation(
          scores[id],
          "Exigência de precisão ou tolerância",
        );
      }
    }

    if (
      requirements.goals.length === 0
    ) {
      for (const id of machineIds) {
        addMissingInformation(
          scores[id],
          "Objetivo da inspeção dimensional",
        );
      }
    }

    if (
      !requirements.nonContactNeeded
    ) {
      addMissingInformation(
        scores["o-inspect"],
        "Necessidade de avaliação sem contato",
      );
    }
  }

  return buildMatches(
    machineIds,
    scores,
  );
}

/*
 * ============================================================
 * DIGITALIZAÇÃO 3D
 * ============================================================
 *
 * Família:
 *
 * ATOS Q
 * T-SCAN
 */

function evaluateScanning(
  piece: PieceConfiguration,
  currentStep: ConfiguratorStep,
): MachineMatch[] {
  const machineIds: MachineId[] = [
    "atos-q",
    "t-scan",
  ];

  const scores: Record<
    MachineId,
    ScoreAccumulator
  > = {
    prismo:
      createAccumulator(0),

    duramax:
      createAccumulator(0),

    "o-inspect":
      createAccumulator(0),

    "atos-q":
      createAccumulator(45),

    "t-scan":
      createAccumulator(45),

    "bosello-max":
      createAccumulator(0),
  };

  for (const id of machineIds) {
    applyPieceContext(
      piece,
      id,
      scores[id],
    );

    addReason(
      scores[id],
      "Tecnologia relacionada à digitalização tridimensional.",
    );
  }

  if (currentStep >= 3) {
    const requirements =
      piece.requirements.scanning;

    /*
     * DETALHAMENTO
     */

    if (
      requirements.detailLevel ===
        "fine-details" ||
      requirements.detailLevel ===
        "maximum-fidelity"
    ) {
      scores["atos-q"].score += 25;

      addReason(
        scores["atos-q"],
        "A aplicação exige pequenos detalhes ou elevada fidelidade na aquisição.",
      );
    }

    if (
      requirements.detailLevel ===
      "general"
    ) {
      scores["t-scan"].score += 8;
    }

    /*
     * OBJETIVOS
     */

    if (
      requirements.goals.includes(
        "cad-comparison",
      ) ||
      requirements.goals.includes(
        "surface-analysis",
      )
    ) {
      scores["atos-q"].score += 12;

      addReason(
        scores["atos-q"],
        "A aplicação envolve comparação ou avaliação detalhada da geometria adquirida.",
      );
    }

    /*
     * ACESSO
     */

    if (
      requirements.access ===
        "partial" ||
      requirements.access ===
        "difficult"
    ) {
      scores["t-scan"].score += 12;

      addReason(
        scores["t-scan"],
        "O acesso informado favorece maior liberdade de movimentação durante a aquisição.",
      );
    }

    /*
     * SUPERFÍCIE
     */

    if (
      requirements.surface ===
        "reflective" ||
      requirements.surface ===
        "transparent" ||
      requirements.surface ===
        "dark"
    ) {
      for (const id of machineIds) {
        addWarning(
          scores[id],
          "A superfície informada pode exigir preparação ou estratégia específica de aquisição óptica.",
        );
      }
    }

    /*
     * LACUNAS
     */

    if (
      requirements.goals.length ===
      0
    ) {
      for (const id of machineIds) {
        addMissingInformation(
          scores[id],
          "Finalidade da digitalização",
        );
      }
    }

    if (
      !requirements.detailLevel
    ) {
      for (const id of machineIds) {
        addMissingInformation(
          scores[id],
          "Nível de detalhe necessário",
        );
      }
    }
  }

  return buildMatches(
    machineIds,
    scores,
  );
}

/*
 * ============================================================
 * CT / ANÁLISE INTERNA
 * ============================================================
 */

function evaluateInternal(
  piece: PieceConfiguration,
  currentStep: ConfiguratorStep,
): MachineMatch[] {
  const target =
    createAccumulator(70);

  addReason(
    target,
    "Tecnologia relacionada à análise e aquisição de características internas.",
  );

  applyPieceContext(
    piece,
    "bosello-max",
    target,
  );

  if (currentStep >= 3) {
    const requirements =
      piece.requirements.ct;

    if (
      requirements.mustRemainIntact ===
      "yes"
    ) {
      target.score += 15;

      addReason(
        target,
        "A peça precisa permanecer intacta, tornando uma estratégia não destrutiva especialmente relevante.",
      );
    }

    if (
      requirements.goals.includes(
        "internal-geometry",
      ) ||
      requirements.goals.includes(
        "internal-dimensions",
      ) ||
      requirements.goals.includes(
        "internal-reconstruction",
      )
    ) {
      target.score += 10;

      addReason(
        target,
        "A aplicação depende diretamente de informações geométricas internas.",
      );
    }

    if (
      requirements.goals.length ===
      0
    ) {
      addMissingInformation(
        target,
        "Objetivo da análise interna",
      );
    }

    if (!requirements.region) {
      addMissingInformation(
        target,
        "Região que precisa ser investigada",
      );
    }
  }

  return [
    {
      machineId:
        "bosello-max",

      score:
        clampScore(
          target.score,
        ),

      level:
        matchLevelFromScore(
          clampScore(
            target.score,
          ),
        ),

      reasons:
        unique(
          target.reasons,
        ),

      warnings:
        unique(
          target.warnings,
        ),

      missingInformation:
        unique(
          target.missingInformation,
        ),
    },
  ];
}

/*
 * ============================================================
 * ENGENHARIA REVERSA
 * ============================================================
 *
 * Engenharia reversa não "recomenda uma máquina de RE".
 *
 * Primeiro decidimos qual forma de aquisição pode ser
 * apropriada para obter a geometria necessária.
 */

function evaluateReverseEngineering(
  piece: PieceConfiguration,
  currentStep: ConfiguratorStep,
): MachineMatch[] {
  const requirements =
    piece.requirements
      .reverseEngineering;

  /*
   * Antes dos requisitos técnicos, ATOS Q, T-SCAN e
   * BOSELLO permanecem candidatas relacionadas ao processo.
   */

  if (currentStep < 3) {
    return [
      ...evaluateScanning(
        piece,
        currentStep,
      ),

      ...evaluateInternal(
        piece,
        currentStep,
      ),
    ];
  }

  if (
    requirements.geometryScope ===
    "internal"
  ) {
    return evaluateInternal(
      piece,
      currentStep,
    );
  }

  if (
    requirements.geometryScope ===
    "external"
  ) {
    return evaluateScanning(
      piece,
      currentStep,
    );
  }

  if (
    requirements.geometryScope ===
    "both"
  ) {
    return mergeMatches([
      ...evaluateScanning(
        piece,
        currentStep,
      ),

      ...evaluateInternal(
        piece,
        currentStep,
      ),
    ]);
  }

  const uncertain =
    mergeMatches([
      ...evaluateScanning(
        piece,
        currentStep,
      ),

      ...evaluateInternal(
        piece,
        currentStep,
      ),
    ]);

  return uncertain.map(
    (match) => ({
      ...match,

      missingInformation:
        unique([
          ...match.missingInformation,

          "Definição se a geometria necessária é externa, interna ou ambas",
        ]),
    }),
  );
}

/*
 * ============================================================
 * MATCH BUILDER
 * ============================================================
 */

function buildMatches(
  machineIds: MachineId[],
  scores: Record<
    MachineId,
    ScoreAccumulator
  >,
): MachineMatch[] {
  return machineIds
    .map(
      (machineId) => {
        const accumulator =
          scores[machineId];

        const score =
          clampScore(
            accumulator.score,
          );

        return {
          machineId,

          score,

          level:
            matchLevelFromScore(
              score,
            ),

          reasons:
            unique(
              accumulator.reasons,
            ),

          warnings:
            unique(
              accumulator.warnings,
            ),

          missingInformation:
            unique(
              accumulator.missingInformation,
            ),
        };
      },
    )
    .sort(
      (a, b) =>
        b.score - a.score,
    );
}

function mergeMatches(
  matches: MachineMatch[],
): MachineMatch[] {
  const merged =
    new Map<
      MachineId,
      MachineMatch
    >();

  for (const match of matches) {
    const current =
      merged.get(
        match.machineId,
      );

    if (!current) {
      merged.set(
        match.machineId,
        {
          ...match,

          reasons: [
            ...match.reasons,
          ],

          warnings: [
            ...match.warnings,
          ],

          missingInformation: [
            ...match.missingInformation,
          ],
        },
      );

      continue;
    }

    const score =
      Math.max(
        current.score,
        match.score,
      );

    merged.set(
      match.machineId,
      {
        machineId:
          match.machineId,

        score,

        level:
          matchLevelFromScore(
            score,
          ),

        reasons:
          unique([
            ...current.reasons,
            ...match.reasons,
          ]),

        warnings:
          unique([
            ...current.warnings,
            ...match.warnings,
          ]),

        missingInformation:
          unique([
            ...current.missingInformation,
            ...match.missingInformation,
          ]),
      },
    );
  }

  return Array.from(
    merged.values(),
  ).sort(
    (a, b) =>
      b.score - a.score,
  );
}

/*
 * ============================================================
 * SERVIÇO
 * ============================================================
 */

function evaluateService(
  piece: PieceConfiguration,
  service: ServiceId,
  currentStep: ConfiguratorStep,
): ServiceRecommendation {
  let matches:
    MachineMatch[];

  switch (service) {
    case "dimensional":
      matches =
        evaluateDimensional(
          piece,
          currentStep,
        );
      break;

    case "scan":
      matches =
        evaluateScanning(
          piece,
          currentStep,
        );
      break;

    case "reverse-engineering":
      matches =
        evaluateReverseEngineering(
          piece,
          currentStep,
        );
      break;

    case "internal":
      matches =
        evaluateInternal(
          piece,
          currentStep,
        );
      break;
  }

  /*
   * Só tratamos a primeira máquina como principal
   * a partir da Etapa 03.
   *
   * Nas Etapas 01 e 02 ainda estamos explorando /
   * pré-selecionando.
   */

  const primaryMachine =
    currentStep >= 3
      ? matches[0]
          ?.machineId ??
        null
      : null;

  return {
    service,

    primaryMachine,

    matches,

    interpretation:
      buildServiceInterpretation(
        service,
        matches,
        currentStep,
      ),
  };
}

function buildServiceInterpretation(
  service: ServiceId,
  matches: MachineMatch[],
  currentStep: ConfiguratorStep,
): string {
  if (currentStep <= 1) {
    return "As tecnologias relacionadas serão avaliadas conforme as características do projeto forem informadas.";
  }

  if (currentStep === 2) {
    return "A pré-seleção considera o porte, tipo da peça e condição de atendimento. Os requisitos técnicos ainda serão avaliados.";
  }

  const primary =
    matches[0];

  if (!primary) {
    return "Ainda não existem informações suficientes para orientar esta aplicação.";
  }

  if (
    service ===
    "reverse-engineering"
  ) {
    return "A tecnologia indicada representa a etapa de aquisição necessária para alimentar o processo de engenharia reversa.";
  }

  return "A aderência foi calculada a partir das características da peça e dos requisitos informados para esta aplicação.";
}

/*
 * ============================================================
 * DEFINIÇÃO DA PEÇA
 * ============================================================
 *
 * Mede quanto conhecemos do projeto.
 *
 * Não representa confiança metrológica.
 */

function calculatePieceDefinition(
  piece: PieceConfiguration,
): number {
  const generalChecks = [
    Boolean(piece.type),

    Boolean(piece.material),

    Boolean(piece.quantity),

    Boolean(
      piece.sizeCategory ||
        hasExactDimensions(
          piece,
        ),
    ),

    Boolean(piece.location),

    piece.services.length >
      0,
  ];

  const requirementChecks: boolean[] =
    [];

  for (
    const service
    of piece.services
  ) {
    if (
      service ===
      "dimensional"
    ) {
      requirementChecks.push(
        piece.requirements
          .dimensional.goals
          .length > 0,

        Boolean(
          piece.requirements
            .dimensional
            .toleranceKnowledge,
        ),
      );
    }

    if (service === "scan") {
      requirementChecks.push(
        piece.requirements
          .scanning.goals
          .length > 0,

        Boolean(
          piece.requirements
            .scanning
            .detailLevel,
        ),
      );
    }

    if (
      service ===
      "reverse-engineering"
    ) {
      requirementChecks.push(
        piece.requirements
          .reverseEngineering
          .goals.length > 0,

        Boolean(
          piece.requirements
            .reverseEngineering
            .geometryScope,
        ),
      );
    }

    if (
      service === "internal"
    ) {
      requirementChecks.push(
        piece.requirements.ct
          .goals.length > 0,

        Boolean(
          piece.requirements.ct
            .region,
        ),
      );
    }
  }

  const checks = [
    ...generalChecks,
    ...requirementChecks,
  ];

  if (!checks.length) {
    return 0;
  }

  const completed =
    checks.filter(Boolean)
      .length;

  return Math.round(
    (completed /
      checks.length) *
      100,
  );
}

/*
 * ============================================================
 * RESUMO DA PEÇA
 * ============================================================
 */

function buildPieceSummary(
  piece: PieceConfiguration,
): string {
  const descriptors:
    string[] = [];

  if (piece.material) {
    descriptors.push(
      "material informado",
    );
  }

  if (
    piece.sizeCategory ||
    hasExactDimensions(piece)
  ) {
    descriptors.push(
      "porte definido",
    );
  }

  if (piece.location) {
    descriptors.push(
      "condição de atendimento definida",
    );
  }

  if (
    piece.services.length ===
    1
  ) {
    descriptors.push(
      "1 serviço selecionado",
    );
  }

  if (
    piece.services.length > 1
  ) {
    descriptors.push(
      `${piece.services.length} serviços combinados`,
    );
  }

  if (
    descriptors.length ===
    0
  ) {
    return "Ainda precisamos conhecer melhor este componente.";
  }

  return `Este componente possui ${descriptors.join(
    ", ",
  )}.`;
}

/*
 * ============================================================
 * PROJETO COMPLETO
 * ============================================================
 */

export function buildProjectRecommendation(
  state: ConfiguratorState,
): ProjectRecommendation {
  /*
   * ETAPA 01
   *
   * Nenhum ranking.
   * Somente candidatas.
   */

  if (
    state.currentStep === 1
  ) {
    const candidates =
      buildCandidateMatches(
        state.projectServices,
      );

    return {
      pieces: [],

      machineMatches:
        candidates,

      activeMachines:
        candidates.map(
          (match) =>
            match.machineId,
        ),

      definitionScore:
        state.projectServices
          .length
          ? 10
          : 0,

      summary:
        state.projectServices
          .length
          ? "Os serviços iniciais foram selecionados. Agora precisamos entender os componentes do projeto."
          : "Selecione o que deseja realizar para começarmos a explorar as tecnologias relacionadas.",

      insights: [],

      missingInformation:
        state.projectServices
          .length
          ? [
              "Características da peça",
              "Requisitos técnicos",
            ]
          : [
              "Necessidade do projeto",
            ],
    };
  }

  /*
   * ETAPA 02 EM DIANTE
   */

  const pieces:
    PieceRecommendation[] =
      state.pieces.map(
        (piece) => {
          const services =
            piece.services.map(
              (service) =>
                evaluateService(
                  piece,
                  service,
                  state.currentStep,
                ),
            );

          const allMatches =
            services.flatMap(
              (service) =>
                service.matches,
            );

          const missingInformation =
            unique(
              allMatches.flatMap(
                (match) =>
                  match.missingInformation,
              ),
            );

          const insights =
            buildPieceInsights(
              piece,
            );

          return {
            pieceId:
              piece.id,

            services,

            definitionScore:
              calculatePieceDefinition(
                piece,
              ),

            summary:
              buildPieceSummary(
                piece,
              ),

            insights,

            missingInformation,
          };
        },
      );

  const allMatches =
    pieces.flatMap(
      (piece) =>
        piece.services.flatMap(
          (service) =>
            service.matches,
        ),
    );

  const machineMatches =
    mergeMatches(
      allMatches,
    );

  const activeMachines =
    machineMatches
      .filter(
        (match) =>
          match.level !==
          "low",
      )
      .map(
        (match) =>
          match.machineId,
      );

  const definitionScore =
    pieces.length
      ? Math.round(
          pieces.reduce(
            (
              total,
              piece,
            ) =>
              total +
              piece.definitionScore,
            0,
          ) /
            pieces.length,
        )
      : 0;

  const insights =
    unique(
      pieces.flatMap(
        (piece) =>
          piece.insights,
      ),
    );

  const missingInformation =
    unique(
      pieces.flatMap(
        (piece) =>
          piece.missingInformation,
      ),
    );

  return {
    pieces,

    machineMatches,

    activeMachines,

    definitionScore,

    summary:
      buildProjectSummary(
        state,
      ),

    insights,

    missingInformation,
  };
}

/*
 * ============================================================
 * INSIGHTS
 * ============================================================
 */

function buildPieceInsights(
  piece: PieceConfiguration,
): string[] {
  const insights:
    string[] = [];

  if (
    piece.sizeCategory ===
    "hand"
  ) {
    insights.push(
      "A peça foi classificada como um componente de pequeno porte.",
    );
  }

  if (
    piece.sizeCategory ===
    "structure"
  ) {
    insights.push(
      "A aplicação envolve uma estrutura ou componente de grande porte.",
    );
  }

  if (
    piece.location ===
    "customer-site"
  ) {
    insights.push(
      "O atendimento precisa ocorrer no local do cliente.",
    );
  }

  if (
    piece.location ===
    "installed"
  ) {
    insights.push(
      "A peça permanece instalada em uma máquina ou estrutura.",
    );
  }

  if (
    piece.services.length >
    1
  ) {
    insights.push(
      "O mesmo componente possui múltiplos serviços relacionados.",
    );
  }

  return insights;
}

function buildProjectSummary(
  state: ConfiguratorState,
): string {
  if (
    state.pieces.length ===
    1
  ) {
    const piece =
      state.pieces[0];

    if (
      piece.services.length ===
      1
    ) {
      return "O projeto possui um componente com uma aplicação técnica configurada.";
    }

    return `O projeto possui um componente com ${piece.services.length} serviços combinados.`;
  }

  const serviceCount =
    unique(
      state.pieces.flatMap(
        (piece) =>
          piece.services,
      ),
    ).length;

  return `O projeto possui ${state.pieces.length} componentes e ${serviceCount} tipos de serviço relacionados.`;
}