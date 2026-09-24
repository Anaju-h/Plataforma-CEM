export function validationResult(issues) {
  return { isValid: issues.length === 0, valid: issues.length === 0, issues, problems: issues.map(issue => issue.message) };
}

export function validateRequestForQuote(request) {
  const issues = [];
  if (!request?.id) issues.push({ code: "request.missing", field: "id", message: "Solicitação de origem inválida." });
  if (request?.status !== "Apta para orçamento") issues.push({ code: "request.not_ready", field: "status", message: "Conclua a análise e deixe a solicitação apta para orçamento." });
  if (request?.linkedQuoteId) issues.push({ code: "request.converted", field: "linkedQuoteId", message: `A solicitação já está vinculada a ${request.linkedQuoteId}.` });
  return validationResult(issues);
}

export function validateRequestAnalysis(analysis, result = "quote-ready") {
  const issues = [];
  const required = (field, value, message) => {
    if (!String(value ?? "").trim()) issues.push({ code: `analysis.${field}`, field, message });
  };
  required("summary", analysis.technicalSummary ?? analysis.summary, "Preencha o resumo técnico antes de concluir a análise.");
  if (result === "waiting-information") required("pendingInformation", analysis.pendingInformation, "Informe quais informações ainda precisam ser recebidas.");
  if (result === "rejected") required("decisionReason", analysis.decisionReason, "Informe o motivo técnico da recusa.");
  if (!["quote-ready", "waiting-information", "rejected"].includes(result)) issues.push({ code: "analysis.result", field: "result", message: "Informe o resultado da análise." });
  return validationResult(issues);
}
