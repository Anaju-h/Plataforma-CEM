"use client";

import {
  useMemo,
  useState,
} from "react";

import { Container } from "@/components/layout/Container";

import { ContactStep } from "./ContactStep";
import { PiecesStep } from "./PiecesStep";
import { ProjectStep } from "./ProjectStep";
import { QuoteProgress } from "./QuoteProgress";
import { ReviewStep } from "./ReviewStep";

import type {
  PieceData,
  ProjectData,
} from "./types";

/* =========================================================
   CONTATO
========================================================= */

type ContactData = {
  name: string;
  company: string;
  email: string;
  phone: string;
};

const initialContactData: ContactData = {
  name: "",
  company: "",
  email: "",
  phone: "",
};

/* =========================================================
   PROJETO
========================================================= */

const initialProjectData: ProjectData = {
  objective: "",

  urgency: "normal",

  deadlineType: "noUrgency",
  specificDate: "",

  observations: "",

  generalFiles: [],
};

/* =========================================================
   CRIA UMA PEÇA VAZIA
========================================================= */

function createPiece(): PieceData {
  return {
    id: crypto.randomUUID(),

    name: "",
    quantity: 1,

    material: "",

    length: "",
    width: "",
    height: "",
    unit: "mm",

    services: [],

    inspectionOptions: [],
    scanningOptions: [],
    reverseOptions: [],
    internalOptions: [],

    transportStatus: "unknown",

    externalService: false,

    locationCity: "",
    locationState: "",

    movable: "",
    surroundingAccess: "",

    locationNotes: "",
  };
}

/* =========================================================
   COMPONENTE
========================================================= */

export function QuoteForm() {
  /* Etapa que está sendo exibida */
  const [
    currentStep,
    setCurrentStep,
  ] = useState(1);

  /*
    Maior etapa que o usuário já acessou.

    Isso permite voltar pelas etapas anteriores
    e depois avançar novamente pela barra superior,
    sem liberar etapas que ainda não foram visitadas.
  */
  const [
    maxStepReached,
    setMaxStepReached,
  ] = useState(1);

  /* Dados de contato */
  const [
    contactData,
    setContactData,
  ] =
    useState<ContactData>(
      initialContactData,
    );

  /* Peças */
  const [
    pieces,
    setPieces,
  ] = useState<PieceData[]>(
    () => [createPiece()],
  );

  /* Dados gerais do projeto */
  const [
    projectData,
    setProjectData,
  ] =
    useState<ProjectData>(
      initialProjectData,
    );

  /* =======================================================
     RESUMOS
  ======================================================== */

  const totalUnits = useMemo(
    () =>
      pieces.reduce(
        (total, piece) =>
          total +
          piece.quantity,
        0,
      ),
    [pieces],
  );

  const externalCount = useMemo(
    () =>
      pieces.filter(
        (piece) =>
          piece.externalService,
      ).length,
    [pieces],
  );

  /* =======================================================
     CONTATO
  ======================================================== */

  function handleContactChange(
    field: keyof ContactData,
    value: string,
  ) {
    setContactData(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );
  }

  /* =======================================================
     PEÇAS
  ======================================================== */

  function handlePieceChange(
    id: string,
    changes: Partial<PieceData>,
  ) {
    setPieces((current) =>
      current.map((piece) =>
        piece.id === id
          ? {
              ...piece,
              ...changes,
            }
          : piece,
      ),
    );
  }

  /*
    Adiciona uma peça NOVA e vazia.

    Nenhuma informação da peça anterior é copiada.
  */
  function handleAddPiece() {
    setPieces((current) => [
      ...current,
      createPiece(),
    ]);
  }

  /*
    Remove uma peça.

    Nunca permite ficar com zero peças.
  */
  function handleDeletePiece(
    id: string,
  ) {
    setPieces((current) =>
      current.length === 1
        ? current
        : current.filter(
            (piece) =>
              piece.id !== id,
          ),
    );
  }

  /* =======================================================
     PROJETO
  ======================================================== */

  function handleProjectChange<
    K extends keyof ProjectData,
  >(
    field: K,
    value: ProjectData[K],
  ) {
    setProjectData(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );
  }

  /* =======================================================
     NAVEGAÇÃO
  ======================================================== */

  /*
    Botão CONTINUAR.

    Exemplo:
    currentStep = 2

    nextStep vira 3.

    Também atualizamos maxStepReached
    caso seja a primeira vez que o usuário
    chegou nessa etapa.
  */
  function handleNext() {
    const nextStep =
      Math.min(
        currentStep + 1,
        4,
      );

    setCurrentStep(
      nextStep,
    );

    setMaxStepReached(
      (current) =>
        Math.max(
          current,
          nextStep,
        ),
    );

    scrollToFormTop();
  }

  /*
    Botão VOLTAR.

    Volta uma etapa sem alterar
    maxStepReached.
  */
  function handleBack() {
    const previousStep =
      Math.max(
        currentStep - 1,
        1,
      );

    setCurrentStep(
      previousStep,
    );

    scrollToFormTop();
  }

  /*
    Clique direto pela barra superior.

    Só permite abrir etapas que
    já foram visitadas.
  */
  function handleStepChange(
    step: number,
  ) {
    if (
      step < 1 ||
      step > maxStepReached
    ) {
      return;
    }

    setCurrentStep(step);

    scrollToFormTop();
  }

  /*
    Utilizada pelos botões "Editar"
    da etapa de revisão.

    Como o usuário já chegou na revisão,
    as etapas anteriores já estão liberadas.
  */
  function handleEditStep(
    step: number,
  ) {
    setCurrentStep(step);

    scrollToFormTop();
  }

  function scrollToFormTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =======================================================
     RENDER
  ======================================================== */

  return (
    <section className="py-10 sm:py-12 lg:py-14">
      <Container>
        <div className="mx-auto max-w-[1180px]">
          {/* =================================================
              BARRA DE PROGRESSO
          ================================================== */}
          <div className="rounded-[22px] border border-[#dfe7ec] bg-white px-5 py-5 shadow-[0_8px_30px_rgba(8,28,44,0.035)] sm:px-7 sm:py-6">
            <QuoteProgress
              currentStep={
                currentStep
              }
              maxStepReached={
                maxStepReached
              }
              onStepChange={
                handleStepChange
              }
            />
          </div>

          {/* =================================================
              CONTEÚDO
          ================================================== */}
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">
            {/* FORMULÁRIO */}
            <div className="rounded-[24px] border border-[#dfe7ec] bg-white p-6 shadow-[0_8px_30px_rgba(8,28,44,0.035)] sm:p-8 lg:p-10">
              {/* ETAPA 01 */}
              {currentStep === 1 && (
                <ContactStep
                  data={contactData}
                  onChange={
                    handleContactChange
                  }
                />
              )}

              {/* ETAPA 02 */}
              {currentStep === 2 && (
                <PiecesStep
                  pieces={pieces}
                  onChange={
                    handlePieceChange
                  }
                  onAdd={
                    handleAddPiece
                  }
                  onDelete={
                    handleDeletePiece
                  }
                />
              )}

              {/* ETAPA 03 */}
              {currentStep === 3 && (
                <ProjectStep
                  data={projectData}
                  onChange={
                    handleProjectChange
                  }
                />
              )}

              {/* ETAPA 04 */}
              {currentStep === 4 && (
                <ReviewStep
                  contact={
                    contactData
                  }
                  pieces={
                    pieces
                  }
                  project={
                    projectData
                  }
                  onEditContact={() =>
                    handleEditStep(
                      1,
                    )
                  }
                  onEditPieces={() =>
                    handleEditStep(
                      2,
                    )
                  }
                  onEditProject={() =>
                    handleEditStep(
                      3,
                    )
                  }
                />
              )}

              {/* =================================================
                  NAVEGAÇÃO INFERIOR
              ================================================== */}
              <div className="mt-10 flex items-center justify-between border-t border-[#e0e7ec] pt-6">
                {/* VOLTAR */}
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={
                      handleBack
                    }
                    className="
                      cursor-pointer
                      rounded-[12px]
                      border border-[#d3dfe6]
                      bg-white
                      px-5 py-3
                      text-sm font-medium text-[#415b6c]
                      transition-all duration-200
                      hover:border-[#9eb9c9]
                      hover:bg-[#f7fafb]
                    "
                  >
                    Voltar
                  </button>
                ) : (
                  <div />
                )}

                {/* CONTINUAR */}
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={
                      handleNext
                    }
                    className="
                      cursor-pointer
                      rounded-[12px]
                      bg-[#0b2340]
                      px-6 py-3
                      text-sm font-medium text-white
                      transition-all duration-200
                      hover:bg-[#123557]
                      hover:shadow-[0_8px_20px_rgba(11,35,64,0.16)]
                    "
                  >
                    Continuar
                  </button>
                ) : (
                  /* ENVIO */
                  <button
                    type="button"
                    className="
                      cursor-pointer
                      rounded-[12px]
                      bg-[#356f9f]
                      px-6 py-3
                      text-sm font-medium text-white
                      transition-all duration-200
                      hover:bg-[#285d89]
                    "
                  >
                    Enviar solicitação
                  </button>
                )}
              </div>
            </div>

            {/* =================================================
                RESUMO LATERAL
            ================================================== */}
            <aside className="h-fit rounded-[24px] border border-[#d8e4eb] bg-[#eef5f8] p-6 lg:sticky lg:top-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#5687ad]">
                Solicitação
              </p>

              <h3 className="mt-3 text-lg font-semibold tracking-[-0.025em] text-[#0b2340]">
                Resumo do projeto
              </h3>

              <div className="mt-6 space-y-5">
                <SummaryItem
                  label="Contato"
                  value={
                    contactData.name ||
                    "Não informado"
                  }
                />

                <SummaryItem
                  label="Empresa"
                  value={
                    contactData.company ||
                    "Não informada"
                  }
                />

                <SummaryItem
                  label="Tipos de peça"
                  value={`${pieces.length}`}
                />

                <SummaryItem
                  label="Unidades"
                  value={`${totalUnits}`}
                />

                <SummaryItem
                  label="Atendimento externo"
                  value={
                    externalCount >
                    0
                      ? `${externalCount} ${
                          externalCount ===
                          1
                            ? "peça"
                            : "peças"
                        }`
                      : "Não indicado"
                  }
                />

                <SummaryItem
                  label="Prioridade"
                  value={getUrgencyLabel(
                    projectData.urgency,
                  )}
                />

                <SummaryItem
                  label="Prazo"
                  value={getDeadlineLabel(
                    projectData,
                  )}
                />

                <SummaryItem
                  label="Arquivos gerais"
                  value={`${projectData.generalFiles.length}`}
                />
              </div>

              {/* ITENS */}
              {currentStep >= 2 && (
                <div className="mt-7 border-t border-[#d3e0e7] pt-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#718895]">
                    Itens
                  </p>

                  <div className="mt-3 space-y-3">
                    {pieces.map(
                      (
                        piece,
                        index,
                      ) => (
                        <div
                          key={
                            piece.id
                          }
                          className="rounded-[12px] border border-[#d5e2e9] bg-white/60 px-3 py-3"
                        >
                          <p className="text-xs font-semibold text-[#0b2340]">
                            {piece.name ||
                              `Peça ${
                                index +
                                1
                              }`}
                          </p>

                          <p className="mt-1 text-[11px] text-[#728691]">
                            {
                              piece.quantity
                            }{" "}
                            {piece.quantity ===
                            1
                              ? "unidade"
                              : "unidades"}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div className="mt-7 border-t border-[#d3e0e7] pt-5">
                <p className="text-xs leading-5 text-[#657b89]">
                  O resumo é atualizado conforme as informações do projeto são preenchidas.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* =========================================================
   RESUMO
========================================================= */

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#718895]">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-medium leading-5 text-[#0b2340]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   LABEL DE PRIORIDADE
========================================================= */

function getUrgencyLabel(
  urgency: ProjectData["urgency"],
) {
  const labels = {
    normal: "Normal",
    priority: "Prioritário",
    urgent: "Urgente",
  };

  return labels[urgency];
}

/* =========================================================
   LABEL DE PRAZO
========================================================= */

function getDeadlineLabel(
  data: ProjectData,
) {
  if (
    data.deadlineType ===
    "15days"
  ) {
    return "Até 15 dias";
  }

  if (
    data.deadlineType ===
    "30days"
  ) {
    return "Até 30 dias";
  }

  if (
    data.deadlineType ===
    "specificDate"
  ) {
    if (!data.specificDate) {
      return "Data a informar";
    }

    const [
      year,
      month,
      day,
    ] =
      data.specificDate.split(
        "-",
      );

    return `${day}/${month}/${year}`;
  }

  return "Sem prazo definido";
}