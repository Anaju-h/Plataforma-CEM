import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  KnowledgeStatusBadge,
} from "../../components/internal/KnowledgeStatusBadge";

import {
  getKnowledgeCategory,
  getKnowledgeItemById,
} from "../../data/internal/knowledge";

export function KnowledgeDetailPage() {
  const navigate =
    useNavigate();

  const {
    knowledgeId,
  } = useParams();

  const item =
    getKnowledgeItemById(
      knowledgeId,
    );

  if (!item) {
    return (
      <div className="mx-auto max-w-[1300px]">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/portal/conhecimento",
            )
          }
          className="text-xs font-semibold text-[#356f9f]"
        >
          ← Voltar para conhecimento
        </button>

        <div className="mt-6 rounded-[22px] border border-[#d1dde4] bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-[#17394f]">
            Conteúdo não encontrado.
          </p>
        </div>
      </div>
    );
  }

  const category =
    getKnowledgeCategory(
      item.category,
    );

  return (
    <div className="mx-auto max-w-[1350px]">
      <button
        type="button"
        onClick={() =>
          navigate(
            "/portal/conhecimento",
          )
        }
        className="mb-5 internal-help-text font-semibold uppercase tracking-[0.1em] text-[#5681a0] transition hover:text-[#0b2340]"
      >
        ← Voltar para conhecimento
      </button>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <section className="rounded-[24px] border border-[#d1dde4] bg-white p-6 shadow-[0_12px_35px_rgba(34,67,90,0.035)] sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="internal-field-label font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
                  {category?.label ??
                    "Conhecimento"}{" "}
                  · {item.id}
                </p>

                <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-[1.12] tracking-[-0.04em] text-[#0b2340]">
                  {item.title}
                </h1>
              </div>

              <KnowledgeStatusBadge
                status={
                  item.status
                }
              />
            </div>

            {item.isDemo && <p className="internal-help-text mt-4 text-[#806b3d]">Referência demo · uso interno. Não é um caso de serviço formalizado e não alimenta recomendações reais.</p>}
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#667f8f]">
              {item.summary}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {item.tags.map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#d3e1e8] bg-[#f5f9fb] px-3 py-1.5 internal-field-label font-medium text-[#607989]"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#d1dde4] bg-white p-6 sm:p-8">
            <p className="internal-field-label font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
              Conteúdo
            </p>

            <div className="mt-6 space-y-8">
              {item.content.map(
                (
                  section,
                  index,
                ) => (
                  <article
                    key={`${section.title}-${index}`}
                  >
                    <div className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c6d9e3] bg-[#edf6fa] internal-field-label font-semibold text-[#5681a0]">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <div>
                        <h2 className="text-base font-semibold text-[#31566d]">
                          {
                            section.title
                          }
                        </h2>

                        <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-7 text-[#6c8290]">
                          {
                            section.text
                          }
                        </p>
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>

          {item.attachments.length >
            0 && (
            <section className="rounded-[24px] border border-[#d1dde4] bg-white p-6 sm:p-8">
              <p className="internal-field-label font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
                Documentos relacionados
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {item.attachments.map(
                  (
                    attachment,
                  ) => (
                    <div
                      key={
                        attachment.id
                      }
                      className="flex items-center gap-4 rounded-[15px] border border-[#d9e3e8] bg-[#f8fafb] p-4 text-left"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#ccdde6] bg-white text-xs text-[#5681a0]">
                        XLS
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-[#31566d]">
                          {
                            attachment.name
                          }
                        </p>

                        <p className="mt-1 internal-field-label uppercase tracking-[0.07em] text-[#84949e]">
                          {
                            attachment.type
                          }
                        </p>

                        <p className="mt-2 internal-help-text leading-4 text-[#7e919c]">
                          {
                            attachment.description
                          }
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-5">
          <section className="rounded-[22px] border border-[#c7d9e3] bg-[#e6f0f5] p-5">
            <p className="internal-field-label font-semibold uppercase tracking-[0.14em] text-[#5681a0]">
              Informações
            </p>

            <div className="mt-5 space-y-5">
              <InfoItem
                label="Categoria"
                value={
                  category?.label
                }
              />

              <InfoItem
                label="Fonte"
                value={
                  item.source
                }
              />

              <InfoItem
                label="Autor"
                value={
                  item.author
                }
              />

              <InfoItem
                label="Revisado por"
                value={
                  item.reviewedBy
                }
              />

              <InfoItem
                label="Última revisão"
                value={
                  item.lastReview
                }
              />
            </div>
          </section>

          {item.relatedMachines.length >
            0 && (
            <RelatedSection
              title="Equipamentos relacionados"
              items={
                item.relatedMachines
              }
            />
          )}

          {item.relatedServices.length >
            0 && (
            <RelatedSection
              title="Serviços relacionados"
              items={
                item.relatedServices
              }
            />
          )}


        </aside>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}) {
  return (
    <div>
      <p className="internal-field-label font-semibold uppercase tracking-[0.1em] text-[#718895]">
        {label}
      </p>

      <p className="mt-1.5 text-xs font-semibold leading-5 text-[#31566d]">
        {value ||
          "Não informado"}
      </p>
    </div>
  );
}

function RelatedSection({
  title,
  items,
}) {
  return (
    <section className="rounded-[22px] border border-[#d1dde4] bg-white p-5">
      <p className="internal-field-label font-semibold uppercase tracking-[0.14em] text-[#718895]">
        {title}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.map(
          (item) => (
            <span
              key={item}
              className="rounded-full border border-[#d2e1e8] bg-[#f5f9fb] px-3 py-1.5 internal-field-label font-semibold text-[#567487]"
            >
              {item}
            </span>
          ),
        )}
      </div>
    </section>
  );
}
