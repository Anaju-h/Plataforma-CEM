import { futureAccessProfiles } from "../data/internal/team";
import { getCurrentTeamMembers, getUserAssignmentName } from "./currentUserService";
import { getRuntimeProjects, isArchivedProject } from "./projectService";
import { getAllQuotes, isArchivedQuote } from "./quoteService";
import { getActiveRequests } from "./requestService";

export async function getTeamOverview() {
  const projects = await getRuntimeProjects();
  const quotes = await getAllQuotes();
  const requests = await getActiveRequests();
  const members = getCurrentTeamMembers().map(member => {
    const assigned = record => record.responsibleId ? record.responsibleId === member.id : record.responsible === getUserAssignmentName(member.id);
    const assignedProjects = projects.filter(assigned);
    const assignedQuotes = quotes.filter(assigned);
    const activeProjects = assignedProjects.filter(project => !isArchivedProject(project));
    const activeQuotes = assignedQuotes.filter(quote => !isArchivedQuote(quote));
    const assignedRequests = requests.filter(assigned);
    const workload = [...assignedRequests, ...activeQuotes, ...activeProjects];
    return { ...member, assignedProjects, assignedQuotes, assignedRequests, activeProjects, activeQuotes,
      workload: { total: workload.length, real: workload.filter(record => record.source === "real").length, demo: workload.filter(record => record.source !== "real").length } };
  });
  return { members, profiles: futureAccessProfiles, activeMembers: members.filter(member => member.status === "Ativo").length,
    activeProjects: projects.filter(project => !isArchivedProject(project)).length,
    activeQuotes: quotes.filter(quote => !isArchivedQuote(quote)).length,
    assignedRequests: members.reduce((sum, member) => sum + member.assignedRequests.length, 0) };
}
