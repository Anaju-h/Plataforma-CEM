/* ============================================================
 * CATÁLOGO DE SERVIÇOS
 * ============================================================
 *
 * Os IDs são estáveis e utilizados internamente pelo sistema.
 *
 * A interface nunca deve exibir diretamente valores como:
 *
 * scan
 * scanning
 * reverse-engineering
 * internal
 *
 * Futuramente este mesmo catálogo poderá receber traduções
 * PT / EN / DE sem alterar os IDs persistidos.
 */

export const SERVICE_OPTIONS = [
  {
    value:
      "dimensional",

    label:
      "Inspeção dimensional",
  },

  {
    value:
      "scan",

    label:
      "Digitalização 3D",
  },

  {
    value:
      "reverse-engineering",

    label:
      "Engenharia reversa",
  },

  {
    value:
      "internal",

    label:
      "Análise interna",
  },
];

/* ============================================================
 * ALIASES LEGADOS
 * ============================================================
 *
 * Aceitamos nomenclaturas antigas para não quebrar registros
 * já existentes em mocks/runtime.
 */

const SERVICE_ALIASES = {
  dimensional:
    "dimensional",

  "inspecao dimensional":
    "dimensional",

  scan:
    "scan",

  scanning:
    "scan",

  "3d scanning":
    "scan",

  "digitalizacao 3d":
    "scan",

  "escaneamento 3d":
    "scan",

  "reverse-engineering":
    "reverse-engineering",

  "reverse engineering":
    "reverse-engineering",

  reverseengineering:
    "reverse-engineering",

  "engenharia reversa":
    "reverse-engineering",

  internal:
    "internal",

  ct:
    "internal",

  "computed tomography":
    "internal",

  tomografia:
    "internal",

  "analise interna":
    "internal",
};

/* ============================================================
 * NORMALIZAÇÃO
 * ============================================================ */

export function normalizeServiceId(
  service,
) {
  if (
    service ===
      null ||
    service ===
      undefined
  ) {
    return "";
  }

  const rawValue =
    String(
      service,
    ).trim();

  if (!rawValue) {
    return "";
  }

  const normalizedKey =
    normalizeKey(
      rawValue,
    );

  return (
    SERVICE_ALIASES[
      normalizedKey
    ] ||
    rawValue
  );
}

/* ============================================================
 * LABEL
 * ============================================================ */

export function getServiceLabel(
  service,
) {
  const serviceId =
    normalizeServiceId(
      service,
    );

  if (!serviceId) {
    return "Não informado";
  }

  const option =
    SERVICE_OPTIONS.find(
      (item) =>
        item.value ===
        serviceId,
    );

  return (
    option?.label ||
    serviceId
  );
}

/* ============================================================
 * AUXILIAR
 * ============================================================ */

function normalizeKey(
  value,
) {
  return String(
    value,
  )
    .normalize(
      "NFD",
    )
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .trim()
    .toLowerCase()
    .replace(
      /_/g,
      "-",
    )
    .replace(
      /\s+/g,
      " ",
    );
}