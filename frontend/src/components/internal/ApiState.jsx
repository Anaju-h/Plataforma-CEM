import { InternalPageHeader } from "./InternalPageHeader";

export function ApiState({ title, description, eyebrow, loading, error, onRetry }) {
  return <div className="mx-auto w-full max-w-[1500px]">
    {title && <InternalPageHeader title={title} description={description} eyebrow={eyebrow} />}
    <div className="internal-body mt-6 rounded-[20px] border border-[#d1dde4] bg-white/80 p-6 text-[#526d7c]" role={error ? "alert" : "status"}>
      <p>{error || loading}</p>
      {error && onRetry && <button type="button" onClick={onRetry} className="internal-field-label mt-4 rounded-[12px] bg-[#096ab2] px-4 py-3 text-white">Tentar novamente</button>}
    </div>
  </div>;
}
