/*
 * Limites de anexos (fotos, CAD, PDF) aplicados antes do envio.
 * Espelham o AttachmentService do backend: o navegador avisa cedo e o servidor continua sendo a garantia.
 */
export const FILE_LIMITS = {
  maxFiles: 10,
  maxFileBytes: 10 * 1024 * 1024,
  maxTotalBytes: 25 * 1024 * 1024,
};

export const ACCEPTED_EXTENSIONS = [
  "jpg", "jpeg", "png", "webp", "gif", "bmp", "heic", "pdf", "step", "stp", "igs", "iges", "stl", "obj", "ply",
  "dwg", "dxf", "x_t", "sldprt", "sldasm", "iam", "ipt", "3mf", "zip", "doc", "docx", "xls", "xlsx", "csv", "txt",
];

export const FILE_LIMITS_HINT = "Até 10 arquivos, 10 MB cada e 25 MB no total.";

const extensionOf = name => (name.includes(".") ? name.slice(name.lastIndexOf(".") + 1).toLowerCase() : "");

/**
 * Filtra os arquivos novos respeitando os limites em relação aos já anexados.
 * Retorna os aceitos e uma mensagem (ou null) explicando o que ficou de fora.
 */
export function acceptFiles(existing, incoming) {
  const accepted = [];
  const problems = [];
  let count = existing.length;
  let total = existing.reduce((sum, file) => sum + (file?.size || 0), 0);

  for (const file of incoming) {
    if (!ACCEPTED_EXTENSIONS.includes(extensionOf(file.name))) { problems.push(`${file.name}: tipo não aceito`); continue; }
    if (file.size > FILE_LIMITS.maxFileBytes) { problems.push(`${file.name}: maior que 10 MB`); continue; }
    if (count >= FILE_LIMITS.maxFiles) { problems.push(`${file.name}: limite de ${FILE_LIMITS.maxFiles} arquivos`); continue; }
    if (total + file.size > FILE_LIMITS.maxTotalBytes) { problems.push(`${file.name}: ultrapassa 25 MB no total`); continue; }
    accepted.push(file);
    count += 1;
    total += file.size;
  }

  const message = problems.length ? `Não adicionados — ${problems.join("; ")}.` : null;
  return { accepted, message };
}
