"use client";

import { PieceCard } from "./PieceCard";
import type { PieceData } from "./types";

type PiecesStepProps = {
  pieces: PieceData[];

  onChange: (
    id: string,
    changes: Partial<PieceData>,
  ) => void;

  onAdd: () => void;

  onDelete: (id: string) => void;
};

export function PiecesStep({
  pieces,
  onChange,
  onAdd,
  onDelete,
}: PiecesStepProps) {
  return (
    <div>
      {/* CABEÇALHO */}
      <div className="border-b border-[#e0e7ec] pb-7">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium tracking-[0.12em] text-[#356f9f]">
            02
          </span>

          <div className="h-px w-8 bg-[#6fa7d1]" />
        </div>

        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#0b2340] sm:text-4xl">
          Peças do projeto
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667887] sm:text-base">
          Cadastre cada tipo de peça individualmente. Cada item pode possuir
          quantidade, serviços, requisitos e logística diferentes.
        </p>
      </div>

      {/* PEÇAS */}
      <div className="mt-7 space-y-5">
        {pieces.map((piece, index) => (
          <PieceCard
            key={piece.id}
            piece={piece}
            index={index}
            canDelete={pieces.length > 1}
            onChange={onChange}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* ADICIONAR PEÇA */}
      <button
        type="button"
        onClick={onAdd}
        className="
          group mt-5 w-full cursor-pointer
          rounded-[18px]
          border border-dashed border-[#9ebccc]
          bg-[#f5f9fb]
          px-5 py-5
          text-sm font-semibold text-[#356f9f]
          transition-all duration-200
          hover:border-[#6f9fbe]
          hover:bg-[#eef6fa]
        "
      >
        <span className="inline-flex items-center gap-2">
          <span className="text-lg font-normal leading-none">
            +
          </span>

          Adicionar outra peça
        </span>
      </button>

      <p className="mt-3 text-center text-[11px] leading-5 text-[#83939d]">
        Cada nova peça será cadastrada com campos independentes.
      </p>
    </div>
  );
}