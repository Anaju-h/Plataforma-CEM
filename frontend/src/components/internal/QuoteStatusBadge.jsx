const styles = {
  Rascunho:
    "border-[#d4dce2] bg-[#f1f4f6] text-[#6d7880]",

  "Em elaboração":
    "border-[#bfd6e5] bg-[#eaf4fa] text-[#34749b]",

  "Em revisão":
    "border-[#ded2b5] bg-[#f7f1e3] text-[#806529]",

  "Aprovado internamente":
    "border-[#bdd8c7] bg-[#eaf5ee] text-[#3b7252]",

  Enviado:
    "border-[#c8c3df] bg-[#f0eef8] text-[#64568b]",

  Aceito:
    "border-[#afd5bd] bg-[#e6f4eb] text-[#337149]",

  Recusado:
    "border-[#e1c0c0] bg-[#faeded] text-[#8b5353]",

  Cancelado:
    "border-[#d5d9dc] bg-[#f1f3f5] text-[#737b82]",
};

export function QuoteStatusBadge({
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
          styles.Rascunho
        }
      `}
    >
      {status}
    </span>
  );
}