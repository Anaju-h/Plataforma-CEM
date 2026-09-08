const styles = {
  Nova:
    "border-[#b7d7e8] bg-[#eaf5fb] text-[#28739c]",

  "Em análise":
    "border-[#c6d4e2] bg-[#edf3f8] text-[#516f86]",

  "Aguardando informações":
    "border-[#e4d7b6] bg-[#f8f2e5] text-[#8a6b29]",

  "Apta para orçamento":
    "border-[#bbd9c7] bg-[#eaf5ee] text-[#3b7252]",

  "Convertida em orçamento":
    "border-[#cbbfe1] bg-[#f1edf8] text-[#675189]",

  Recusada:
    "border-[#e2c4c4] bg-[#f9eeee] text-[#8e5555]",

  Cancelada:
    "border-[#d4d8dc] bg-[#f1f3f5] text-[#737b82]",
};

export function StatusBadge({
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
          styles.Cancelada
        }
      `}
    >
      {status}
    </span>
  );
}