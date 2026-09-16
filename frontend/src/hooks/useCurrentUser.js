import { useSyncExternalStore } from "react";
import { getCurrentUser, subscribeCurrentUser } from "../services/currentUserService";

export function useCurrentUser() {
  return useSyncExternalStore(subscribeCurrentUser, getCurrentUser, getCurrentUser);
}
