export function ValidationFeedback({ validation, title }) {
  return <div className="internal-help-text rounded-[14px] border border-[#d3dfe6] bg-[#f8fafb] p-4 text-[#526d7c]" aria-live="polite">
    <p className="internal-card-title font-semibold text-[#31566d]">{title}</p>
    {validation.isValid
      ? <p className="mt-2">Todos os dados obrigatórios foram preenchidos.</p>
      : <ul className="mt-2 list-disc space-y-1 pl-5">{validation.issues.map((issue, index) => <li key={`${issue.code}-${issue.field}-${index}`}>{issue.message}</li>)}</ul>}
  </div>;
}

export function FieldIssue({ issues, field }) {
  const messages = issues.filter(issue => issue.field === field);
  return messages.length ? <span className="internal-help-text mt-1 block text-[#9a5947]">{messages.map(issue => issue.message).join(" ")}</span> : null;
}
