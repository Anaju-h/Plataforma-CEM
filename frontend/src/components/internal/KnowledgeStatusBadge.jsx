const styles = {
  Revisado:
    "border-[#b9d8c5] bg-[#eaf5ee] text-[#3b7252]",

  "Em validação":
    "border-[#dfd3b5] bg-[#f8f2e5] text-[#806529]",

  Referência:
    "border-[#bfd6e5] bg-[#eaf4fa] text-[#34749b]",

  "Pendente de análise":
    "border-[#d7d9dc] bg-[#f1f3f5] text-[#707980]",
};

export function KnowledgeStatusBadge({
  status,
}) {
  return (
    <span
      className={`
        inline-flex
        rounded-full
        border
        px-3 py-1.5
        text-[9px]
        font-semibold
        uppercase
        tracking-[0.07em]

        ${
          styles[status] ??
          styles["Pendente de análise"]
        }
      `}
    >
      {status}
    </span>
  );
}