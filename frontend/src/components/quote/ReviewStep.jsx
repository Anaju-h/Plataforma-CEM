const serviceLabels = {
  inspection: "Inspeção dimensional",
  scanning: "Digitalização 3D",
  reverse: "Engenharia reversa",
  internal: "Análise interna",
};

export function ReviewStep({
  contact,
  pieces,
  project,
  onEditContact,
  onEditPieces,
  onEditProject,
}) {
  const totalUnits = pieces.reduce(
    (total, piece) => total + piece.quantity,
    0,
  );

  return (
    <div>
      <div className="border-b border-[#e0e7ec] pb-7">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium tracking-[0.12em] text-[#356f9f]">
            04
          </span>

          <div className="h-px w-8 bg-[#6fa7d1]" />
        </div>

        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-4xl">
          Revisão da solicitação
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667887] sm:text-base">
          Confira as informações antes de enviar. Você poderá voltar às etapas
          anteriores caso precise fazer alguma alteração.
        </p>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Tipos de peça"
          value={`${pieces.length}`}
        />

        <SummaryCard
          label="Total de unidades"
          value={`${totalUnits}`}
        />

        <SummaryCard
          label="Prazo"
          value={getDeadlineLabel(project)}
        />
      </div>

      <ReviewSection
        number="01"
        title="Contato"
        onEdit={onEditContact}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <ReviewItem
            label="Nome"
            value={contact.name || "Não informado"}
          />

          <ReviewItem
            label="Empresa"
            value={contact.company || "Não informada"}
          />

          <ReviewItem
            label="E-mail"
            value={contact.email || "Não informado"}
          />

          <ReviewItem
            label="Telefone"
            value={contact.phone || "Não informado"}
          />
        </div>
      </ReviewSection>

      <ReviewSection
        number="02"
        title="Peças do projeto"
        onEdit={onEditPieces}
      >
        <div className="space-y-4">
          {pieces.map((piece, index) => (
            <PieceReviewCard
              key={piece.id}
              piece={piece}
              index={index}
            />
          ))}
        </div>
      </ReviewSection>

      <ReviewSection
        number="03"
        title="Projeto"
        onEdit={onEditProject}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <ReviewItem
            label="Prioridade"
            value={getUrgencyLabel(project.urgency)}
          />

          <ReviewItem
            label="Prazo desejado"
            value={getDeadlineLabel(project)}
          />
        </div>

        <div className="mt-6">
          <ReviewItem
            label="Objetivo geral"
            value={project.objective || "Não informado"}
          />
        </div>

        <div className="mt-6">
          <ReviewItem
            label="Observações"
            value={
              project.observations ||
              "Nenhuma observação adicionada"
            }
          />
        </div>

        <div className="mt-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#718895]">
            Arquivos gerais
          </p>

          {project.generalFiles.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {project.generalFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="rounded-[12px] border border-[#dce5ea] bg-[#f8fafb] px-4 py-3"
                >
                  <p className="truncate text-sm font-medium text-[#0b2340]">
                    {file.name}
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.06em] text-[#84949e]">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-[#71838f]">
              Nenhum arquivo geral adicionado.
            </p>
          )}
        </div>
      </ReviewSection>

      <div className="mt-7 rounded-[18px] border border-[#cfe0e9] bg-[#f1f7fa] px-5 py-5">
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#356f9f]">
          Antes do envio
        </p>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#617786]">
          O envio da solicitação não representa a confirmação do orçamento ou
          do prazo. As informações serão avaliadas pela equipe técnica antes da
          elaboração da proposta final.
        </p>
      </div>
    </div>
  );
}

function PieceReviewCard({
  piece,
  index,
}) {
  const dimensions =
    piece.length || piece.width || piece.height
      ? `${piece.length || "—"} × ${piece.width || "—"} × ${
          piece.height || "—"
        } ${piece.unit}`
      : "Não informadas";

  return (
    <div className="rounded-[20px] border border-[#dce5ea] bg-[#f8fafb] p-5 sm:p-6">
      <div className="flex flex-col gap-3 border-b border-[#e0e7ec] pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#5687ad]">
            Peça {String(index + 1).padStart(2, "0")}
          </p>

          <h4 className="mt-1.5 text-lg font-semibold text-[#0b2340]">
            {piece.name || `Peça ${index + 1}`}
          </h4>
        </div>

        <div className="rounded-full border border-[#d4e2e9] bg-white px-3 py-1.5 text-xs font-medium text-[#356f9f]">
          {piece.quantity}{" "}
          {piece.quantity === 1 ? "unidade" : "unidades"}
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ReviewItem
          label="Material"
          value={piece.material || "Não informado"}
        />

        <ReviewItem
          label="Dimensões"
          value={dimensions}
        />

        <ReviewItem
          label="Transporte"
          value={getTransportLabel(piece)}
        />
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#718895]">
          Serviços
        </p>

        {piece.services.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {piece.services.map((service) => (
              <span
                key={service}
                className="rounded-full border border-[#d0e1ea] bg-white px-3 py-2 text-xs font-medium text-[#356f9f]"
              >
                {serviceLabels[service]}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-[#71838f]">
            Nenhum serviço selecionado.
          </p>
        )}
      </div>

      {piece.externalService && (
        <div className="mt-6 rounded-[16px] border border-[#cfe0e9] bg-[#eef6fa] p-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#356f9f]">
            Atendimento in loco
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ReviewItem
              label="Local"
              value={
                piece.locationCity || piece.locationState
                  ? `${piece.locationCity || "Cidade não informada"}${
                      piece.locationState
                        ? ` - ${piece.locationState}`
                        : ""
                    }`
                  : "Não informado"
              }
            />

            <ReviewItem
              label="Movimentação"
              value={getMovableLabel(piece.movable)}
            />
          </div>

          {piece.locationNotes && (
            <div className="mt-4">
              <ReviewItem
                label="Observações do local"
                value={piece.locationNotes}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReviewSection({
  number,
  title,
  onEdit,
  children,
}) {
  return (
    <section className="border-b border-[#e3e9ed] py-8 last:border-0">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#5687ad]">
            {number}
          </p>

          <h3 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-[#0b2340]">
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="cursor-pointer rounded-[10px] border border-[#d4e0e6] bg-white px-4 py-2 text-xs font-medium text-[#356f9f] transition-all hover:border-[#9bb9ca] hover:bg-[#f8fafb]"
        >
          Editar
        </button>
      </div>

      {children}
    </section>
  );
}

function ReviewItem({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#718895]">
        {label}
      </p>

      <p className="mt-1.5 whitespace-pre-line text-sm font-medium leading-6 text-[#0b2340]">
        {value}
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}) {
  return (
    <div className="rounded-[18px] border border-[#d9e5ec] bg-[#f2f7fa] p-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#5687ad]">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold text-[#0b2340]">
        {value}
      </p>
    </div>
  );
}

function getUrgencyLabel(urgency) {
  const labels = {
    normal: "Normal",
    priority: "Prioritário",
    urgent: "Urgente",
  };

  return labels[urgency] ?? "Normal";
}

function getDeadlineLabel(data) {
  if (data.deadlineType === "15days") {
    return "Até 15 dias";
  }

  if (data.deadlineType === "30days") {
    return "Até 30 dias";
  }

  if (data.deadlineType === "specificDate") {
    if (!data.specificDate) {
      return "Data a informar";
    }

    const [year, month, day] =
      data.specificDate.split("-");

    return `${day}/${month}/${year}`;
  }

  return "Sem prazo definido";
}

function getTransportLabel(piece) {
  if (piece.transportStatus === "yes") {
    return "Pode ser levada ao Centro";
  }

  if (piece.transportStatus === "no") {
    return "Necessita avaliação in loco";
  }

  return "Ainda não definido";
}

function getMovableLabel(movable) {
  const labels = {
    yes: "Sim",
    no: "Não",
    partial: "Parcialmente",
    "": "Não informado",
  };

  return labels[movable] ?? "Não informado";
}

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}