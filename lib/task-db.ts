import { Task, TaskStatus } from "../types/task";

// ⚠️ IMPORTANT: This array simulates a database. Data is volatile and resets on server restart.
let nextId = 1;
let tasks: Task[] = [];

// --- POST (Create) Operation ---
export const createTask = (title: string, description: string): Task => {
  // Use the built-in crypto.randomUUID() for a standard UUID (Universally Unique Identifier)
  const newId = nextId.toString();

  nextId++;
  const newTask: Task = {
    id: newId,
    title,
    description,
    status: "Not Started",
    createdAt: Date.now(),
  };
  tasks.push(newTask);
  return newTask;
};

export const getTasks = (): Task[] => {
  return tasks;
};

export const getTaskById = (id: string): Task | undefined => {
  return tasks.find((task) => task.id === id);
};

export const updateTask = (
  id: string,
  updates: Partial<Task>
): Task | undefined => {
  const index = tasks.findIndex((task) => task.id === id);

  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    return tasks[index];
  }
  return undefined;
};

export const deleteTask = (id: string): boolean => {
  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);
  return tasks.length < initialLength; // Returns true if a task was actually removed
};
