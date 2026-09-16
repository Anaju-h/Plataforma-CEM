import {
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  InternalPageHeader,
} from "../../components/internal/InternalPageHeader";

import {
  ProjectStatusBadge,
} from "../../components/internal/ProjectStatusBadge";

import {
  RequestDetailSection,
  RequestInfoItem,
} from "../../components/internal/RequestDetailSection";

import {
  getRuntimeQuoteById,
} from "../../services/quoteService";

import {
  completeRuntimeProject,
  getRuntimeProjectById,
  isArchivedProject,
  reopenRuntimeProject,
  returnProjectToExecution,
  saveProjectInternalNotes,
  sendProjectToReview,
  startProjectExecution,
  startProjectPreparation,
  updateProjectTask,
} from "../../services/projectService";

const currentUser =
  "Administrador";

export function ProjectDetailPage() {
  const navigate =
    useNavigate();

  const {
    projectId,
  } = useParams();

  const initialProject =
    getRuntimeProjectById(
      projectId,
    );

  const [
    project,
    setProject,
  ] = useState(
    initialProject,
  );

  const [
    internalNotes,
    setInternalNotes,
  ] = useState(
    initialProject
      ?.internalNotes ??
      "",
  );

  const [
    feedback,
    setFeedback,
  ] = useState("");

  const [
    confirmationAction,
    setConfirmationAction,
  ] = useState(null);

  if (!project) {
    return (
      <div className="mx-auto max-w-[1400px]">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/portal/projetos",
            )
          }
          className="text-xs font-semibold text-[#356f9f]"
        >
          ← Voltar para projetos
        </button>

        <div className="mt-6 rounded-[22px] border border-[#d1dde4] bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-[#17394f]">
            Projeto não encontrado.
          </p>
        </div>
      </div>
    );
  }

  const quote =
    getRuntimeQuoteById(
      project.quoteId,
    );

  const completedCount =
    project.tasks.filter(
      (task) =>
        task.completed,
    ).length;

  const progress =
    project.tasks.length
      ? Math.round(
          (completedCount /
            project.tasks.length) *
            100,
        )
      : 0;

  const isCompleted = isArchivedProject(project);

  function toggleTask(
    taskId,
  ) {
    try {
      const task =
        project.tasks.find(
          (item) =>
            item.id ===
            taskId,
        );

      if (!task) {
        return;
      }

      const updatedProject =
        updateProjectTask(
          project.id,
          taskId,
          !task.completed,
          currentUser,
        );

      setProject(
        updatedProject,
      );
    } catch (error) {
      showFeedback(
        error.message,
      );
    }
  }

  function handleSaveNotes() {
    try {
      const updatedProject =
        saveProjectInternalNotes(
          project.id,
          internalNotes,
          currentUser,
        );

      setProject(
        updatedProject,
      );

      setInternalNotes(
        updatedProject
          .internalNotes ??
          "",
      );

      showFeedback(
        "Observações internas salvas.",
      );
    } catch (error) {
      showFeedback(
        error.message,
      );
    }
  }

  function handleStartPreparation() {
    try {
      const updatedProject =
        startProjectPreparation(
          project.id,
          currentUser,
        );

      setProject(
        updatedProject,
      );

      showFeedback(
        "Planejamento concluído. Projeto aguardando execução.",
      );
    } catch (error) {
      showFeedback(
        error.message,
      );
    }
  }

  function handleStartExecution() {
    try {
      const updatedProject =
        startProjectExecution(
          project.id,
          currentUser,
        );

      setProject(
        updatedProject,
      );

      showFeedback(
        "Execução do projeto iniciada.",
      );
    } catch (error) {
      showFeedback(
        error.message,
      );
    }
  }

  function handleSendToReview() {
    try {
      const updatedProject =
        sendProjectToReview(
          project.id,
          currentUser,
        );

      setProject(
        updatedProject,
      );

      showFeedback(
        "Projeto enviado para revisão.",
      );
    } catch (error) {
      showFeedback(
        error.message,
      );
    }
  }

  function handleReturnToExecution() {
    try {
      const updatedProject =
        returnProjectToExecution(
          project.id,
          currentUser,
        );

      setProject(
        updatedProject,
      );

      showFeedback(
        "Projeto retornou para execução.",
      );
    } catch (error) {
      showFeedback(
        error.message,
      );
    }
  }

  function handleCompleteProject() {
    try {
      const updatedProject =
        completeRuntimeProject(
          project.id,
          currentUser,
        );

      setProject(
        updatedProject,
      );

      setConfirmationAction(
        null,
      );

      showFeedback(
        "Projeto concluído.",
      );
    } catch (error) {
      setConfirmationAction(
        null,
      );

      showFeedback(
        error.message,
      );
    }
  }

  function handleReopenProject() {
    try {
      const updatedProject =
        reopenRuntimeProject(
          project.id,
          currentUser,
        );

      setProject(
        updatedProject,
      );

      setConfirmationAction(
        null,
      );

      showFeedback(
        "Projeto reaberto.",
      );
    } catch (error) {
      setConfirmationAction(
        null,
      );

      showFeedback(
        error.message,
      );
    }
  }

  function showFeedback(
    message,
  ) {
    setFeedback(
      message,
    );

    window.setTimeout(
      () => {
        setFeedback("");
      },
      2600,
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[1500px]">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/portal/projetos",
            )
          }
          className="mb-5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5681a0] transition hover:text-[#0b2340]"
        >
          ← Voltar para projetos
        </button>

        <InternalPageHeader
          eyebrow={`${project.quoteId} · ${project.id}`}
          title={
            project.company
          }
          description={
            project.description
          }
          action={
            <ProjectStatusBadge
              status={
                project.status
              }
            />
          }
        />

        {feedback && (
          <div className="mt-5 flex items-center gap-3 rounded-[14px] border border-[#bcd8c7] bg-[#ebf5ee] px-4 py-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-[#3d7453]">
              ✓
            </span>

            <p className="text-xs font-semibold text-[#3d7453]">
              {feedback}
            </p>
          </div>
        )}

        {isCompleted && (
          <div className="mt-5 rounded-[14px] border border-[#bad7c5] bg-[#eef7f1] px-4 py-3">
            <p className="text-xs leading-5 text-[#557767]">
              Este projeto está encerrado. O checklist e as observações internas estão bloqueados. O registro permanece disponível no Histórico.
            </p>
          </div>
        )}

        <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_330px]">
          <div className="space-y-5">
            <RequestDetailSection
              eyebrow="01"
              title="Informações do projeto"
              description="Dados principais do serviço que avançou para execução."
            >
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <RequestInfoItem
                  label="Projeto"
                  value={
                    project.id
                  }
                />

                <RequestInfoItem
                  label="Orçamento de origem"
                  value={
                    project.quoteId
                  }
                />

                <RequestInfoItem
                  label="Cliente"
                  value={
                    project.company
                  }
                />

                <RequestInfoItem
                  label="Serviço"
                  value={
                    project.service
                  }
                />

                <RequestInfoItem
                  label="Equipamento"
                  value={
                    project.machine
                  }
                />

                <RequestInfoItem
                  label="Responsável"
                  value={
                    project.responsible
                  }
                />
              </div>
            </RequestDetailSection>

            <RequestDetailSection
              eyebrow="02"
              title="Acompanhamento operacional"
              description="Checklist simples para acompanhar o andamento do serviço."
            >
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#718895]">
                    Progresso
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#31566d]">
                    {completedCount} de{" "}
                    {project.tasks.length} etapas concluídas
                  </p>
                </div>

                <p className="text-2xl font-semibold text-[#096ab2]">
                  {progress}%
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e2e9ed]">
                <div
                  className="h-full rounded-full bg-[#1684c5] transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="mt-6 space-y-2">
                {project.tasks.map(
                  (task) => (
                    <button
                      key={
                        task.id
                      }
                      type="button"
                      disabled={
                        isCompleted
                      }
                      onClick={() =>
                        toggleTask(
                          task.id,
                        )
                      }
                      className={`
                        flex w-full
                        items-center gap-3
                        rounded-[14px]
                        border
                        px-4 py-3.5
                        text-left
                        transition

                        ${
                          isCompleted
                            ? "cursor-not-allowed border-[#d7e0e5] bg-[#f2f5f6] opacity-75"
                            : task.completed
                              ? "border-[#bad7c5] bg-[#eef7f1]"
                              : "border-[#d9e3e8] bg-[#f8fafb] hover:border-[#aec8d5]"
                        }
                      `}
                    >
                      <span
                        className={`
                          flex h-7 w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          text-[10px]
                          font-semibold

                          ${
                            task.completed
                              ? "border-[#8fc2a1] bg-white text-[#397250]"
                              : "border-[#c4d5de] bg-white text-[#82949e]"
                          }
                        `}
                      >
                        {task.completed
                          ? "✓"
                          : ""}
                      </span>

                      <span
                        className={`
                          text-xs
                          font-semibold

                          ${
                            task.completed
                              ? "text-[#557767] line-through"
                              : "text-[#31566d]"
                          }
                        `}
                      >
                        {
                          task.title
                        }
                      </span>
                    </button>
                  ),
                )}
              </div>

              <div className="mt-5 rounded-[14px] border border-[#cbdde6] bg-[#edf6fa] p-4">
                <p className="text-[10px] leading-5 text-[#6d8390]">
                  O checklist registra o andamento básico do serviço. A conclusão de todas as etapas não encerra o projeto automaticamente: a finalização continua dependendo de uma ação explícita após a revisão.
                </p>
              </div>
            </RequestDetailSection>

            <RequestDetailSection
              eyebrow="03"
              title="Observações internas"
              description="Registros operacionais importantes para acompanhamento da execução."
            >
              <textarea
                value={
                  internalNotes
                }
                disabled={
                  isCompleted
                }
                onChange={(event) =>
                  setInternalNotes(
                    event.target.value,
                  )
                }
                rows={6}
                placeholder="Registre observações importantes sobre a execução..."
                className={`
                  w-full
                  rounded-[13px]
                  border border-[#d3dfe6]
                  px-4 py-3
                  text-sm
                  leading-6
                  outline-none
                  transition

                  ${
                    isCompleted
                      ? "cursor-not-allowed resize-none bg-[#eef2f4] text-[#748995]"
                      : "resize-y bg-[#f8fafb] text-[#294e64] focus:border-[#78a9c4] focus:bg-white"
                  }
                `}
              />

              {!isCompleted && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={
                      handleSaveNotes
                    }
                    className="rounded-[11px] bg-[#096ab2] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.09em] text-white transition hover:bg-[#075b99]"
                  >
                    Salvar observações
                  </button>
                </div>
              )}
            </RequestDetailSection>

            <RequestDetailSection
              eyebrow="04"
              title="Histórico operacional"
              description="Registro das principais movimentações realizadas durante o projeto."
            >
              {project.history?.length >
              0 ? (
                <div>
                  {project.history.map(
                    (
                      item,
                      index,
                    ) => (
                      <ProjectHistoryItem
                        key={
                          item.id ??
                          `${item.action}-${index}`
                        }
                        item={
                          item
                        }
                        last={
                          index ===
                          project.history
                            .length -
                            1
                        }
                      />
                    ),
                  )}
                </div>
              ) : (
                <EmptyBlock text="Nenhuma movimentação operacional registrada neste projeto." />
              )}
            </RequestDetailSection>
          </div>

          <aside className="space-y-5">
            <section className="rounded-[22px] border border-[#c7d9e3] bg-[#e6f0f5] p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
                Execução
              </p>

              <div className="mt-5 space-y-5">
                <SideInfo
                  label="Status"
                  value={
                    project.status
                  }
                />

                <SideInfo
                  label="Prazo"
                  value={
                    project.deadline
                  }
                />

                <SideInfo
                  label="Prioridade"
                  value={
                    project.priority
                  }
                />

                <SideInfo
                  label="Responsável"
                  value={
                    project.responsible
                  }
                />
              </div>

              <div className="mt-6 border-t border-[#c9dbe4] pt-5">
                <ProjectWorkflowActions
                  project={
                    project
                  }
                  progress={
                    progress
                  }
                  onStartPreparation={
                    handleStartPreparation
                  }
                  onStartExecution={
                    handleStartExecution
                  }
                  onSendToReview={
                    handleSendToReview
                  }
                  onReturnToExecution={
                    handleReturnToExecution
                  }
                  onComplete={() =>
                    setConfirmationAction(
                      "complete",
                    )
                  }
                  onReopen={() =>
                    setConfirmationAction(
                      "reopen",
                    )
                  }
                />
              </div>
            </section>

            {project.status ===
              "Aguardando revisão" && (
              <section className="rounded-[22px] border border-[#e0d5ba] bg-[#f8f2e5] p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8b733b]">
                  Revisão
                </p>

                <p className="mt-3 text-lg font-semibold text-[#735f32]">
                  Aguardando validação
                </p>

                <p className="mt-2 text-xs leading-5 text-[#8a7854]">
                  Revise os resultados antes de concluir o projeto. Se forem necessários ajustes, retorne para execução.
                </p>
              </section>
            )}

            {project.status ===
              "Concluído" && (
              <section className="rounded-[22px] border border-[#bad7c5] bg-[#eef7f1] p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#4b795c]">
                  Situação
                </p>

                <p className="mt-3 text-lg font-semibold text-[#315f45]">
                  Projeto concluído
                </p>

                <p className="mt-2 text-xs leading-5 text-[#708778]">
                  A execução foi finalizada e o projeto está encerrado. Ele pode ser reaberto caso sejam necessários novos ajustes.
                </p>
              </section>
            )}

            <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#718895]">
                Origem comercial
              </p>

              <p className="mt-3 text-xl font-semibold tracking-[-0.025em] text-[#17394f]">
                {
                  project.quoteId
                }
              </p>

              {quote ? (
                <>
                  <div className="mt-4 space-y-4">
                    <SideInfo
                      label="Status comercial"
                      value={
                        quote.status
                      }
                    />

                    <SideInfo
                      label="Valor contratado"
                      value={
                        quote.proposedValue >
                        0
                          ? formatCurrency(
                              quote.proposedValue,
                            )
                          : "A definir"
                      }
                    />

                    <SideInfo
                      label="Prazo comercial"
                      value={
                        quote.deadlineDays >
                        0
                          ? `${quote.deadlineDays} dias`
                          : "A definir"
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/portal/orcamentos/${project.quoteId}`,
                      )
                    }
                    className="mt-5 w-full rounded-[11px] bg-[#096ab2] px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.09em] text-white transition hover:bg-[#075b99]"
                  >
                    Abrir orçamento
                  </button>
                </>
              ) : (
                <div className="mt-4 rounded-[12px] border border-[#e0d5ba] bg-[#f8f2e5] p-3">
                  <p className="text-[10px] leading-5 text-[#80672f]">
                    O orçamento de origem não está disponível nesta sessão.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#718895]">
                Rastreabilidade
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-[#607989]">
                <span className="rounded-full border border-[#d4e1e7] bg-[#f5f9fb] px-3 py-1.5">
                  {quote?.requestId ??
                    "Solicitação"}
                </span>

                <span>→</span>

                <span className="rounded-full border border-[#bdd5e2] bg-[#edf6fa] px-3 py-1.5 text-[#356f9f]">
                  {
                    project.quoteId
                  }
                </span>

                <span>→</span>

                <span className="rounded-full border border-[#b9d6e4] bg-[#e6f1f6] px-3 py-1.5 text-[#096ab2]">
                  {
                    project.id
                  }
                </span>
              </div>

              <p className="mt-3 text-[10px] leading-5 text-[#82949e]">
                A solicitação e o orçamento permanecem preservados para rastreabilidade, enquanto a execução é conduzida neste projeto.
              </p>
            </section>

            <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#718895]">
                Controle
              </p>

              <div className="mt-4 space-y-4">
                <SideInfo
                  label="Criado em"
                  value={
                    project.createdAt
                  }
                />

                <SideInfo
                  label="Última atualização"
                  value={
                    project.updatedAt
                  }
                />

                {project.completedAt && (
                  <SideInfo
                    label="Concluído em"
                    value={
                      project.completedAt
                    }
                  />
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {confirmationAction ===
        "complete" && (
        <ConfirmationModal
          eyebrow="Finalizar projeto"
          title={`Concluir ${project.id}?`}
          description={
            progress === 100
              ? "Todas as etapas estão concluídas. O projeto será encerrado e ficará bloqueado para edição."
              : "Ainda existem etapas pendentes. O sistema não permitirá a conclusão enquanto o checklist não estiver 100% concluído."
          }
          confirmLabel="Concluir projeto"
          onCancel={() =>
            setConfirmationAction(
              null,
            )
          }
          onConfirm={
            handleCompleteProject
          }
        />
      )}

      {confirmationAction ===
        "reopen" && (
        <ConfirmationModal
          eyebrow="Reabrir projeto"
          title={`Reabrir ${project.id}?`}
          description="O projeto voltará para o status Em andamento e poderá receber novos ajustes, alterações no checklist e observações."
          confirmLabel="Reabrir projeto"
          onCancel={() =>
            setConfirmationAction(
              null,
            )
          }
          onConfirm={
            handleReopenProject
          }
        />
      )}
    </>
  );
}

function ProjectWorkflowActions({
  project,
  progress,
  onStartPreparation,
  onStartExecution,
  onSendToReview,
  onReturnToExecution,
  onComplete,
  onReopen,
}) {
  if (
    project.status ===
    "Planejamento"
  ) {
    return (
      <>
        <WorkflowLabel text="Próxima etapa" />

        <PrimaryButton
          onClick={
            onStartPreparation
          }
        >
          Concluir planejamento
        </PrimaryButton>
      </>
    );
  }

  if (
    project.status ===
    "Aguardando execução"
  ) {
    return (
      <>
        <WorkflowLabel text="Próxima etapa" />

        <PrimaryButton
          onClick={
            onStartExecution
          }
        >
          Iniciar execução
        </PrimaryButton>
      </>
    );
  }

  if (
    project.status ===
    "Em andamento"
  ) {
    return (
      <>
        <WorkflowLabel text="Execução ativa" />

        <PrimaryButton
          onClick={
            onSendToReview
          }
        >
          Enviar para revisão
        </PrimaryButton>
      </>
    );
  }

  if (
    project.status ===
    "Aguardando revisão"
  ) {
    return (
      <>
        <WorkflowLabel text="Revisão técnica" />

        <PrimaryButton
          onClick={
            onComplete
          }
        >
          Concluir projeto
        </PrimaryButton>

        <SecondaryButton
          onClick={
            onReturnToExecution
          }
        >
          Solicitar ajustes
        </SecondaryButton>

        {progress < 100 && (
          <p className="mt-3 text-[10px] leading-5 text-[#7e7254]">
            Existem etapas pendentes no checklist. A conclusão será bloqueada até o progresso chegar a 100%.
          </p>
        )}
      </>
    );
  }

  if (
    project.status ===
    "Concluído"
  ) {
    return (
      <>
        <WorkflowLabel text="Projeto encerrado" />

        <SecondaryButton
          onClick={
            onReopen
          }
        >
          Reabrir projeto
        </SecondaryButton>
      </>
    );
  }

  return (
    <div className="rounded-[12px] border border-[#d2dee4] bg-white/70 px-4 py-3">
      <p className="text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-[#718895]">
        Nenhuma ação disponível
      </p>
    </div>
  );
}

function WorkflowLabel({
  text,
}) {
  return (
    <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#5681a0]">
      {text}
    </p>
  );
}

function PrimaryButton({
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="w-full rounded-[12px] bg-[#096ab2] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.09em] text-white transition hover:bg-[#075b99]"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="mt-2 w-full rounded-[12px] border border-[#aac6d5] bg-white px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.09em] text-[#356f9f] transition hover:bg-[#f8fbfc]"
    >
      {children}
    </button>
  );
}

function ConfirmationModal({
  eyebrow,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#071a2b]/50 px-4 backdrop-blur-[3px]">
      <div className="w-full max-w-[500px] rounded-[24px] border border-white/30 bg-white p-6 shadow-[0_35px_100px_rgba(7,26,43,0.25)] sm:p-7">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#17394f]">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#708795]">
          {description}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={
              onCancel
            }
            className="rounded-[11px] border border-[#d0dce3] bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#607989]"
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={
              onConfirm
            }
            className="rounded-[11px] bg-[#096ab2] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-white"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectHistoryItem({
  item,
  last,
}) {
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {!last && (
        <div className="absolute left-[15px] top-8 h-[calc(100%-20px)] w-px bg-[#d5e2e8]" />
      )}

      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#bfd5e1] bg-[#edf6fa] text-[9px] text-[#5681a0]">
        ✓
      </div>

      <div className="pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold text-[#31566d]">
            {
              item.action
            }
          </p>

          <span className="text-[9px] text-[#8c9ba4]">
            {item.date}

            {item.time
              ? ` · ${item.time}`
              : ""}
          </span>
        </div>

        {item.actor && (
          <p className="mt-1 text-[10px] font-medium text-[#708795]">
            por {
              item.actor
            }
          </p>
        )}

        {item.description && (
          <p className="mt-2 text-xs leading-5 text-[#768b97]">
            {
              item.description
            }
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyBlock({
  text,
}) {
  return (
    <div className="rounded-[15px] border border-dashed border-[#cad9e1] bg-[#f8fafb] px-5 py-8 text-center">
      <p className="text-xs leading-5 text-[#7c909b]">
        {text}
      </p>
    </div>
  );
}

function SideInfo({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#718895]">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-[#31566d]">
        {value ||
          "A definir"}
      </p>
    </div>
  );
}

function formatCurrency(
  value,
) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style:
        "currency",

      currency:
        "BRL",
    },
  ).format(
    value ||
      0,
  );
}
