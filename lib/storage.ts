import type { AppState, Task } from "@/types/task";
import { isTaskStatus } from "@/types/task";

export const STORAGE_KEY = "kanban-todo:v1";

export const INITIAL_STATE: AppState = {
  version: 1,
  tasks: [],
};

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const testKey = `${STORAGE_KEY}:available`;
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return null;
  }
}

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== "object") {
    return false;
  }

  const task = value as Record<string, unknown>;

  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.description === "string" &&
    isTaskStatus(task.status) &&
    typeof task.createdAt === "string" &&
    typeof task.updatedAt === "string"
  );
}

function isAppState(value: unknown): value is AppState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const state = value as Record<string, unknown>;

  return (
    state.version === 1 &&
    Array.isArray(state.tasks) &&
    state.tasks.every(isTask)
  );
}

export function loadState(): AppState {
  const storage = getStorage();

  if (!storage) {
    return INITIAL_STATE;
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);

    if (!raw) {
      return INITIAL_STATE;
    }

    const parsed: unknown = JSON.parse(raw);

    return isAppState(parsed) ? parsed : INITIAL_STATE;
  } catch {
    return INITIAL_STATE;
  }
}

export function saveState(state: AppState): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable or full. Keep the in-memory state alive.
  }
}
