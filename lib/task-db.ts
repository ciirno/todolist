// src/lib/task-db-fs.ts
import fs from "fs";
import path from "path";
import { Task } from "../types/task";

const DATA_DIR = path.join(process.cwd(), "data");
const TASKS_FILE = path.join(DATA_DIR, "tasks.json");

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// --- Internal Helpers ---
const readTasksFromFile = (): Task[] => {
  ensureDataDir();
  if (!fs.existsSync(TASKS_FILE)) return [];

  try {
    const raw = fs.readFileSync(TASKS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading tasks file:", err);
    return [];
  }
};

const writeTasksToFile = (tasks: Task[]): void => {
  ensureDataDir();
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error("Error writing tasks file:", err);
  }
};

// --- Utility to manage ID counter ---
const getNextId = (tasks: Task[]): string => {
  const maxId = tasks.length
    ? Math.max(...tasks.map((t) => parseInt(t.id)))
    : 0;
  return (maxId + 1).toString();
};

// --- CRUD ---
export const getTasks = (): Task[] => {
  return readTasksFromFile();
};

export const getTaskById = (id: string): Task | undefined => {
  const tasks = readTasksFromFile();
  return tasks.find((t) => t.id === id);
};

export const createTask = (title: string, description: string): Task => {
  const tasks = readTasksFromFile();

  const newTask: Task = {
    id: getNextId(tasks),
    title,
    description,
    status: "Not Started",
    createdAt: Date.now(),
  };

  tasks.push(newTask);
  writeTasksToFile(tasks);
  return newTask;
};

export const updateTask = (
  id: string,
  updates: Partial<Task>
): Task | undefined => {
  const tasks = readTasksFromFile();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) return undefined;

  tasks[index] = { ...tasks[index], ...updates };
  writeTasksToFile(tasks);
  return tasks[index];
};

export const deleteTask = (id: string): boolean => {
  const tasks = readTasksFromFile();
  const filtered = tasks.filter((t) => t.id !== id);

  if (filtered.length === tasks.length) return false;

  writeTasksToFile(filtered);
  return true;
};

export const clearAllTasks = (): void => {
  ensureDataDir();
  if (fs.existsSync(TASKS_FILE)) {
    fs.unlinkSync(TASKS_FILE);
  }
};
