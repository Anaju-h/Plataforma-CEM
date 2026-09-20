import {
  getRequestNeed,
  requestNeeds,
} from "../../data/requestNeeds";

export function RequestNeedSelector({
  value,
  onChange,
}) {
  const selectedNeed = getRequestNeed(value);

  return (
    <section className="border-b border-[#e3e9ed] py-7">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[#0b2340]">
          Necessidade principal
        </h3>

        <p className="mt-1 text-xs leading-5 text-[#788993]">
          Selecione primeiro o objetivo do atendimento. Assim, o formulário
          solicita apenas as informações realmente necessárias.
        </p>
      </div>

      <div className="max-w-3xl">
        <select
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className={inputClasses}
        >
          <option value="">Selecione uma necessidade</option>

          {requestNeeds.map((need) => (
            <option key={need.id} value={need.id}>
              {need.name}
            </option>
          ))}
        </select>

        {selectedNeed && (
          <div className="mt-4 rounded-[14px] border border-[#c8dce6] bg-[#f2f8fb] px-4 py-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#aac8d8] bg-white text-[10px] font-semibold text-[#477b98]">
                {selectedNeed.number}
              </span>

              <div>
                <p className="text-sm font-semibold text-[#264e66]">
                  {selectedNeed.title}
                </p>

                <p className="mt-1.5 text-xs leading-5 text-[#708894]">
                  {selectedNeed.description}
                </p>

                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#58839a]">
                  {selectedNeed.tag}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const inputClasses = `
  h-12 w-full
  rounded-[12px]
  border border-[#d6e0e6]
  bg-white
  px-4
  text-sm text-[#0b2340]
  outline-none
  transition-all duration-200
  hover:border-[#b8cbd7]
  focus:border-[#568fb8]
  focus:ring-4
  focus:ring-[#568fb8]/10
`;