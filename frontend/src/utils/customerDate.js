// Operational timestamps are stored in UTC; date-only deadlines retain their calendar day.
export function customerDate(value) {
  if (!value) return "A definir";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value.split("-").reverse().join("/");
  const date = new Date(/[Z+-]\d*:?\d*$/.test(value.slice(10)) ? value : `${value.slice(0, 19)}Z`);
  return Number.isNaN(date.getTime()) ? "A definir" : date.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short",
  });
}
