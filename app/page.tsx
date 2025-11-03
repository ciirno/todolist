// src/app/page.tsx

// Use client component directive because we are using useState and fetch on the client
"use client";

import { useState, useEffect } from "react";
// Import the Task type definition
import { Task, TaskStatus } from "@/types/task";

const API_URL = "/api/tasks"; // Your base URL for the Next.js Route Handlers

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // --- API Functions ---

  // 1. GET /tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // Fallback for empty/error state
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // 2. POST /tasks
  const addTask = async () => {
    if (!newTaskTitle.trim()) return alert("Task title cannot be empty."); // Basic Validation

    try {
      console.log(fetch(API_URL));
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: "A new task.", // Default description
          status: "On-Going", // 'Not Started', 'In Progress', or 'Completed'
          createdAt: Date(), // Timestamp for creation
        }),
      });

      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const newTask: Task = await response.json();
      setTasks((prev) => [...prev, newTask]); // Add new task to state
      setNewTaskTitle(""); // Clear input
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // 3. PUT /tasks/:id (Toggle Status)
  const toggleTaskStatus = async (id: string, currentStatus: TaskStatus) => {
    const newStatus: TaskStatus =
      currentStatus === "Completed" ? "Not Started" : "Completed";

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      // Update the local state with the new status (optimistic update is also an option)
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // 4. DELETE /tasks/:id
  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Note: DELETE returns 204 No Content for success
        throw new Error("Failed to delete task");
      }

      // Remove the task from local state
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // --- Statistics Calculation ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const completedPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6 text-black dark:text-white">
        To-Do List
      </h1>

      {/* Basic Stat Display */}
      <div className="bg-blue-100 p-4 rounded-lg shadow-md mb-6 dark:bg-blue-900">
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Basic Stats
        </h2>
        <p className="flex flex-col text-blue-700 dark:text-blue-300">
          <span className="font-bold">Total Tasks</span> {totalTasks}
          <span className="font-bold">Completed</span>
          {completedTasks}&nbsp;(
          {completedPercentage}%)
        </p>
      </div>

      {/* Task Input Form */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter new task title..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white dark:bg-zinc-800 dark:border-zinc-700"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          disabled={!newTaskTitle.trim()}>
          Add Task
        </button>
      </div>

      {/* Task List (List-View) */}
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
        Task List
      </h2>

      {loading && <p className="text-center text-gray-500">Loading tasks...</p>}

      {!loading && tasks.length === 0 && (
        <p className="text-center text-gray-500">
          No tasks found. Add a new one!
        </p>
      )}

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
            <div className="flex flex-col flex-grow">
              <span
                className={`text-lg font-medium ${
                  task.status === "Completed"
                    ? "line-through text-gray-500"
                    : "text-black dark:text-white"
                }`}>
                {task.title}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Status: {task.status} | ID: {task.id.substring(0, 8)}...
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Button */}
              <button
                onClick={() => toggleTaskStatus(task.id, task.status)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  task.status === "Completed"
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}>
                {task.status === "Completed" ? "Restart" : "Complete"}
              </button>

              {/* Delete Button */}
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
