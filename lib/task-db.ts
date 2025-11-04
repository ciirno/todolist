import fs from "fs";
import path from "path";
import { Task } from "../types/task";

// File path for persistent JSON storage
const DATA_FILE_PATH = path.join(process.cwd(), "data", "tasks.json");

// --- Helper functions for file I/O ---
interface TaskData {
  nextId: number;
  tasks: Task[];
}

const initializeFileIfMissing = (): void => {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    const initialData: TaskData = { nextId: 1, tasks: [] };
    fs.mkdirSync(path.dirname(DATA_FILE_PATH), { recursive: true });
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialData, null, 2));
  }
};

const readData = (): TaskData => {
  initializeFileIfMissing();

  try {
    const data = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return { nextId: 1, tasks: [] };
  }
};

const writeData = (data: TaskData): void => {
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
};

// --- CRUD operations ---
export const createTask = (title: string, description: string): Task => {
  const data = readData();
  const newTask: Task = {
    id: data.nextId.toString(),
    title,
    description,
    status: "Not Started",
    createdAt: Date.now(),
  };

  data.tasks.push(newTask);
  data.nextId++;
  writeData(data);

  return newTask;
};

export const getTasks = (): Task[] => {
  return readData().tasks;
};

export const getTaskById = (id: string): Task | undefined => {
  const { tasks } = readData();
  return tasks.find((task) => task.id === id);
};

export const updateTask = (
  id: string,
  updates: Partial<Task>
): Task | undefined => {
  const data = readData();
  const index = data.tasks.findIndex((task) => task.id === id);

  if (index !== -1) {
    data.tasks[index] = { ...data.tasks[index], ...updates };
    writeData(data);
    return data.tasks[index];
  }

  return undefined;
};

export const deleteTask = (id: string): boolean => {
  const data = readData();
  const newTasks = data.tasks.filter((task) => task.id !== id);

  if (newTasks.length !== data.tasks.length) {
    data.tasks = newTasks;
    writeData(data);
    return true;
  }

  return false;
};

// --- Utility: Reset all tasks ---
export const clearAllTasks = (): void => {
  writeData({ nextId: 1, tasks: [] });
};
