import { getEquipmentLabel } from "../data/serviceCatalog";
import { listPersistedProjects, getPersistedProject, createPersistedProject, updatePersistedProject } from "./projectApi";
import { getMachineCostKnowledge } from "../data/internal/pricingKnowledge";
import { getAcceptedProposalVersion } from "./proposalService";

function adapt(project) {
  return { ...project, machine: getEquipmentLabel(project.serviceId, getMachineCostKnowledge(project.machineId)?.name ?? project.machine ?? project.machineId), deadline: project.deadline || "A definir" };
}
export function isArchivedProject(project) { return ["Concluído", "Cancelado"].includes(project.status); }
export async function getRuntimeProjects() { return (await listPersistedProjects()).map(adapt); }
export async function getRuntimeProjectById(id) { return adapt(await getPersistedProject(id)); }
export async function getActiveProjects() { return (await getRuntimeProjects()).filter(project => !isArchivedProject(project)); }
export async function getArchivedProjects() { return (await getRuntimeProjects()).filter(isArchivedProject); }
export function canCreateProject(quote) {
  return quote?.status === "Aceito" && !quote.projectId && Boolean(getAcceptedProposalVersion(quote.proposal));
}
export async function createProjectFromQuote(quote) {
  if (quote.projectId) return getRuntimeProjectById(quote.projectId);
  if (!canCreateProject(quote)) throw new Error("Somente orçamentos com proposta aceita podem gerar projeto.");
  return adapt(await createPersistedProject(quote.id));
}
async function mutate(project, operation, data = {}) {
  return adapt(await updatePersistedProject(project.id, { ...data, operation, revision: project.revision }));
}
export const updateProjectTask = (project, taskId, completed) => mutate(project, "task", { taskId, completed });
export const saveProjectInternalNotes = (project, internalNotes) => mutate(project, "notes", { internalNotes });
export const startProjectPreparation = project => mutate(project, "prepare");
export const startProjectExecution = project => mutate(project, "start");
export const sendProjectToReview = project => mutate(project, "review");
export const returnProjectToExecution = project => mutate(project, "return");
export const completeRuntimeProject = project => mutate(project, "complete");
export const reopenRuntimeProject = project => mutate(project, "reopen");
