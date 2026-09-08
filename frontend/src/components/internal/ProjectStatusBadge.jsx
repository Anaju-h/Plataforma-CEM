const styles = {
  Planejamento:
    "border-[#c8d7e3] bg-[#edf3f8] text-[#526f86]",

  "Aguardando execução":
    "border-[#dfd4b7] bg-[#f7f1e4] text-[#806629]",

  "Em andamento":
    "border-[#bcd6e5] bg-[#eaf4fa] text-[#34749b]",

  "Aguardando revisão":
    "border-[#c9c3df] bg-[#f0eef8] text-[#64568b]",

  Concluído:
    "border-[#b7d8c4] bg-[#e8f5ed] text-[#397250]",

  Pausado:
    "border-[#d7d9dc] bg-[#f1f3f5] text-[#707980]",

  Cancelado:
    "border-[#e1c1c1] bg-[#faeded] text-[#8b5353]",
};

export function ProjectStatusBadge({
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
          styles.Planejamento
        }
      `}
    >
      {status}
    </span>
  );
}