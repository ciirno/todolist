export type TaskStatus = "Not Started" | "In Progress" | "Completed";

export interface Task {
  id: string; // Unique identifier (UUID is common)
  title: string; // Task title
  description: string; // Task details
  status: TaskStatus; // 'Not Started', 'In Progress', or 'Completed'
  createdAt: number; // Timestamp for creation
  completedAt: number;
}
