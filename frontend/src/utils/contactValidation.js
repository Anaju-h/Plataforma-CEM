/* ============================================================
 * VALIDAÇÃO DE CONTATO
 * ============================================================
 *
 * Utilitário compartilhado pelos formulários da plataforma.
 *
 * Não depende da interface.
 * Pode ser reutilizado futuramente no backend/API client,
 * área do cliente e outros formulários.
 * ============================================================ */

export const EMAIL_SUFFIXES = [
  ".com.br",
  ".com",
  ".org.br",
  ".net.br",
];

/* ============================================================
 * E-MAIL
 * ============================================================ */

export function sanitizeEmail(
  value,
) {
  return String(
    value ?? "",
  )
    .replace(
      /\s+/g,
      "",
    )
    .slice(
      0,
      254,
    );
}

export function isValidEmail(
  value,
) {
  const email =
    sanitizeEmail(
      value,
    );

  if (!email) {
    return false;
  }

  if (
    email.includes(
      "..",
    )
  ) {
    return false;
  }

  const parts =
    email.split(
      "@",
    );

  if (
    parts.length !==
    2
  ) {
    return false;
  }

  const [
    localPart,
    domain,
  ] = parts;

  if (
    !localPart ||
    !domain
  ) {
    return false;
  }

  if (
    localPart.length >
      64 ||
    domain.length >
      253
  ) {
    return false;
  }

  /*
   * Exige:
   *
   * nome@dominio.com
   * nome@empresa.com.br
   *
   * Não aceita:
   *
   * aaa
   * aaa@
   * aaa@empresa
   * aaa@empresa.
   * aaa @empresa.com
   */
  const pattern =
    /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

  return pattern.test(
    email,
  );
}

export function canSuggestEmailSuffix(
  value,
) {
  const email =
    sanitizeEmail(
      value,
    );

  if (
    !email ||
    isValidEmail(
      email,
    )
  ) {
    return false;
  }

  const [
    localPart,
    domain,
  ] =
    email.split(
      "@",
    );

  return Boolean(
    localPart &&
      domain,
  );
}

export function applyEmailSuffix(
  value,
  suffix,
) {
  const email =
    sanitizeEmail(
      value,
    );

  const atIndex =
    email.indexOf(
      "@",
    );

  if (
    atIndex <= 0
  ) {
    return email;
  }

  const localPart =
    email.slice(
      0,
      atIndex,
    );

  const domainPart =
    email
      .slice(
        atIndex + 1,
      )
      .replace(
        /^\.+|\.+$/g,
        "",
      );

  if (
    !domainPart
  ) {
    return email;
  }

  /*
   * Se a pessoa digitou:
   *
   * ana@empresa
   *   -> ana@empresa.com.br
   *
   * ana@empresa.c
   *   -> ana@empresa.com.br
   *
   * ana@empresa.com.b
   *   -> ana@empresa.com.br
   *
   * A sugestão só aparece enquanto o e-mail ainda é inválido.
   */

  const domainParts =
    domainPart.split(
      ".",
    );

  const baseDomain =
    domainParts[0];

  if (
    !baseDomain
  ) {
    return email;
  }

  return `${localPart}@${baseDomain}${suffix}`;
}

/* ============================================================
 * TELEFONE
 * ============================================================ */

export function formatPhone(
  value,
) {
  const numbers =
    String(
      value ?? "",
    )
      .replace(
        /\D/g,
        "",
      )
      .slice(
        0,
        11,
      );

  if (
    numbers.length <=
    2
  ) {
    return numbers
      ? `(${numbers}`
      : "";
  }

  if (
    numbers.length <=
    6
  ) {
    return `(${numbers.slice(
      0,
      2,
    )}) ${numbers.slice(
      2,
    )}`;
  }

  if (
    numbers.length <=
    10
  ) {
    return `(${numbers.slice(
      0,
      2,
    )}) ${numbers.slice(
      2,
      6,
    )}-${numbers.slice(
      6,
    )}`;
  }

  return `(${numbers.slice(
    0,
    2,
  )}) ${numbers.slice(
    2,
    7,
  )}-${numbers.slice(
    7,
  )}`;
}

export function isValidPhone(
  value,
) {
  const numbers =
    String(
      value ?? "",
    ).replace(
      /\D/g,
      "",
    );

  return (
    numbers.length ===
      10 ||
    numbers.length ===
      11
  );
}

/* ============================================================
 * VALIDAÇÃO COMPLETA
 * ============================================================ */

export function validateContactData(
  data,
) {
  const errors = {
    name:
      "",

    email:
      "",

    phone:
      "",
  };

  if (
    !String(
      data?.name ?? "",
    ).trim()
  ) {
    errors.name =
      "Informe o nome do contato.";
  }

  const email =
    sanitizeEmail(
      data?.email,
    );

  if (!email) {
    errors.email =
      "Informe o e-mail.";
  } else if (
    !isValidEmail(
      email,
    )
  ) {
    errors.email =
      "Informe um e-mail válido, como nome@empresa.com.br.";
  }

  const phone =
    String(
      data?.phone ?? "",
    ).trim();

  if (!phone) {
    errors.phone =
      "Informe o telefone.";
  } else if (
    !isValidPhone(
      phone,
    )
  ) {
    errors.phone =
      "Informe um telefone com DDD e 10 ou 11 dígitos.";
  }

  return {
    valid:
      !errors.name &&
      !errors.email &&
      !errors.phone,

    errors,
  };
}