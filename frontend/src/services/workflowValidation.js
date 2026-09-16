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
