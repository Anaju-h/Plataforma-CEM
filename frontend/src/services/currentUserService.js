import { teamMembers } from "../data/internal/team";

// Identidade operacional estável; nome de exibição não renomeia históricos.
const initialUser = teamMembers[0];
let currentUser = Object.freeze({ ...initialUser, email: initialUser.email === "A definir" ? "" : initialUser.email });
const listeners = new Set();

export function getCurrentUser() { return currentUser; }
export function subscribeCurrentUser(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function getCurrentTeamMembers() {
  return teamMembers.map(member => member.id === currentUser.id ? currentUser : member);
}
export function getUserAssignmentName(userId) {
  return teamMembers.find(member => member.id === userId)?.name ?? null;
}
export function updateCurrentUser({ name, email }) {
  const nextName = String(name ?? "").trim();
  const nextEmail = String(email ?? "").trim();
  if (!nextName) throw new Error("Informe o nome de exibição.");
  if (nextEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) throw new Error("Informe um e-mail válido ou deixe o campo vazio.");
  if (nextName === currentUser.name && nextEmail === currentUser.email) return currentUser;
  const words = nextName.split(/\s+/);
  const initials = (words.length > 1 ? words[0][0] + words.at(-1)[0] : nextName.slice(0, 2)).toUpperCase();
  currentUser = Object.freeze({ ...currentUser, name: nextName, email: nextEmail, initials });
  listeners.forEach(listener => listener());
  return currentUser;
}
