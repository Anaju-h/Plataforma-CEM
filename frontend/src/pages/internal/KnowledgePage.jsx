import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  InternalPageHeader,
} from "../../components/internal/InternalPageHeader";

import {
  KnowledgeStatusBadge,
} from "../../components/internal/KnowledgeStatusBadge";

import {
  knowledgeCategories,
  knowledgeItems,
} from "../../data/internal/knowledge";

export function KnowledgePage() {
  const navigate =
    useNavigate();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState("all");

  const filteredItems =
    useMemo(() => {
      const normalizedSearch =
        normalizeText(
          search,
        );

      return knowledgeItems.filter(
        (item) => {
          const matchesCategory =
            category === "all" ||
            item.category ===
              category;

          const searchableContent =
            [
              item.id,
              item.title,
              item.summary,
              item.source,
              ...item.tags,
              ...item.relatedMachines,
              ...item.relatedServices,
            ]
              .join(" ")
              .toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            normalizeText(
              searchableContent,
            ).includes(
              normalizedSearch,
            );

          return (
            matchesCategory &&
            matchesSearch
          );
        },
      );
    }, [
      search,
      category,
    ]);

  return (
    <div className="mx-auto max-w-[1500px]">
      <InternalPageHeader
        eyebrow="Conhecimento"
        title="Base de conhecimento"
        description="Centralize conhecimento técnico, operacional e corporativo para facilitar consultas, decisões e a continuidade do trabalho no laboratório."
        action={
          <button
            type="button"
            className="internal-eyebrow rounded-[12px] bg-[#096ab2] px-5 py-3 font-semibold uppercase text-white transition hover:bg-[#075b99]"
          >
            + Novo conteúdo
          </button>
        }
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Conteúdos"
          value={
            knowledgeItems.length
          }
          detail="Registros disponíveis na base."
        />

        <MetricCard
          label="Categorias"
          value={
            knowledgeCategories.length
          }
          detail="Áreas de conhecimento."
        />

        <MetricCard
          label="Revisados"
          value={
            knowledgeItems.filter(
              (item) =>
                item.status ===
                "Revisado",
            ).length
          }
          detail="Conteúdos com revisão registrada."
        />

        <MetricCard
          label="Pendentes"
          value={
            knowledgeItems.filter(
              (item) =>
                item.status ===
                  "Pendente de análise" ||
                item.status ===
                  "Em validação",
            ).length
          }
          detail="Itens que ainda demandam validação."
        />
      </div>

      <section className="mt-5 rounded-[20px] border border-[#d1dde4] bg-white p-4 shadow-[0_10px_30px_rgba(34,67,90,0.025)]">
        <div className="grid gap-3 lg:grid-cols-[1fr_230px]">
          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Pesquisar equipamento, tecnologia, procedimento, palavra-chave..."
            className="internal-field-value 
              h-11
              w-full
              rounded-[12px]
              border border-[#d7e1e7]
              bg-[#f9fbfc]
              px-4
              
              text-[#17394f]
              outline-none
              transition
              placeholder:text-[#526d7c]
              focus:border-[#76a9c7]
              focus:bg-white
            "
          />

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value,
              )
            }
            className="internal-field-value 
              h-11
              rounded-[12px]
              border border-[#d7e1e7]
              bg-[#f9fbfc]
              px-3
              
              font-medium
              text-[#536f80]
              outline-none
              transition
              focus:border-[#76a9c7]
              focus:bg-white
            "
          >
            <option value="all">
              Todas as categorias
            </option>

            {knowledgeCategories.map(
              (item) => (
                <option
                  key={
                    item.id
                  }
                  value={
                    item.id
                  }
                >
                  {
                    item.label
                  }
                </option>
              ),
            )}
          </select>
        </div>
      </section>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {filteredItems.map(
          (item) => (
            <KnowledgeCard
              key={item.id}
              item={item}
              onClick={() =>
                navigate(
                  `/portal/conhecimento/${item.id}`,
                )
              }
            />
          ),
        )}
      </div>

      {filteredItems.length ===
        0 && (
        <div className="mt-5 rounded-[20px] border border-dashed border-[#cbd9e1] bg-[#f8fafb] px-6 py-16 text-center">
          <p className="internal-card-title font-semibold text-[#536f80]">
            Nenhum conteúdo encontrado.
          </p>

          <p className="internal-help-text mt-2 text-[#526d7c]">
            Tente alterar a busca ou a categoria selecionada.
          </p>
        </div>
      )}
    </div>
  );
}

function KnowledgeCard({
  item,
  onClick,
}) {
  const category =
    knowledgeCategories.find(
      (candidate) =>
        candidate.id ===
        item.category,
    );

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[245px] w-full flex-col rounded-[20px] border border-[#d1dde4] bg-white p-5 text-left shadow-[0_8px_25px_rgba(34,67,90,0.02)] transition hover:-translate-y-[2px] hover:border-[#a9c6d6] hover:shadow-[0_15px_35px_rgba(34,67,90,0.06)] sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="internal-eyebrow font-semibold uppercase text-[#5681a0]">
            {category?.label ??
              "Conhecimento"}
          </p>

          <p className="internal-card-title mt-1 font-medium tracking-[0.08em] text-[#526d7c]">
            {item.id}
          </p>
        </div>

        <KnowledgeStatusBadge
          status={
            item.status
          }
        />
      </div>

      <h2 className="internal-section-title mt-5 font-semibold text-[#17394f]">
        {item.title}
      </h2>

      <p className="internal-section-description mt-2 line-clamp-3 text-[#526d7c]">
        {item.summary}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {item.tags
          .slice(0, 4)
          .map((tag) => (
            <span
              key={tag}
              className="internal-help-text rounded-full border border-[#d5e2e8] bg-[#f5f9fb] px-2.5 py-1 text-[#526d7c]"
            >
              {tag}
            </span>
          ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-[#e5ebef] pt-5">
        <div>
          <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
            Última revisão
          </p>

          <p className="internal-card-title mt-1 font-medium text-[#607989]">
            {item.lastReview}
          </p>
        </div>

        <span className="text-[#5681a0] transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </button>
  );
}

function MetricCard({
  label,
  value,
  detail,
}) {
  return (
    <div className="rounded-[20px] border border-[#d1dde4] bg-white p-5">
      <p className="internal-eyebrow font-semibold uppercase text-[#526d7c]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#17394f]">
        {value}
      </p>

      <p className="internal-card-description mt-3 text-[#526d7c]">
        {detail}
      </p>
    </div>
  );
}

function normalizeText(
  value,
) {
  return String(
    value ?? "",
  )
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .trim();
}