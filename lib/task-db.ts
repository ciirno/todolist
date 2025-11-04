import { Task } from "../types/task";

const TASKS_KEY = "tasks";
const NEXT_ID_KEY = "nextId";

// --- Safe Local Storage Helpers ---
const readTasksFromStorage = (): Task[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const writeTasksToStorage = (tasks: Task[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

const readNextId = (): number => {
  if (typeof window === "undefined") return 1;
  const savedId = localStorage.getItem(NEXT_ID_KEY);
  return savedId ? parseInt(savedId, 10) : 1;
};

const writeNextId = (nextId: number): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(NEXT_ID_KEY, nextId.toString());
};

// --- CRUD Operations ---
export const createTask = (title: string, description: string): Task => {
  const tasks = readTasksFromStorage();

  const currentId = readNextId();
  const newId = currentId.toString();
  writeNextId(currentId + 1);

  const newTask: Task = {
    id: newId,
    title,
    description,
    status: "Not Started",
    createdAt: Date.now(),
  };

  tasks.push(newTask);
  writeTasksToStorage(tasks);
  return newTask;
};

export const getTasks = (): Task[] => readTasksFromStorage();

export const getTaskById = (id: string): Task | undefined =>
  readTasksFromStorage().find((task) => task.id === id);

export const updateTask = (
  id: string,
  updates: Partial<Task>
): Task | undefined => {
  const tasks = readTasksFromStorage();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return undefined;

  tasks[index] = { ...tasks[index], ...updates };
  writeTasksToStorage(tasks);
  return tasks[index];
};

export const deleteTask = (id: string): boolean => {
  const tasks = readTasksFromStorage();
  const filtered = tasks.filter((task) => task.id !== id);
  if (filtered.length === tasks.length) return false;

  writeTasksToStorage(filtered);
  return true;
};

export const clearAllTasks = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TASKS_KEY);
  localStorage.setItem(NEXT_ID_KEY, "1");
};
