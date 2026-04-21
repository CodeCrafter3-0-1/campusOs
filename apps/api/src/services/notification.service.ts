import { dataStore } from "../repositories/data-store";

export function listNotifications() {
  return dataStore.notifications;
}
