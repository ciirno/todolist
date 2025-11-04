// src/app/page.tsx

// Use client component directive because we are using useState and fetch on the client
"use client";

import { useState, useEffect } from "react";
// Import the Task type definition
import { Task, TaskStatus } from "@/types/task";
import { formatTime } from "../lib/date";
const API_URL = "/api/tasks"; // Your base URL for the Next.js Route Handlers

// --- NEW COMPONENT: Delete Confirmation Modal ---
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskId: string | null;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-2xl w-full max-w-sm">
        <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
          Confirm Deletion
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete Task ID:{" "}
          <span className="font-mono text-sm bg-gray-100 dark:bg-zinc-700 p-1 rounded">
            {taskId}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-300 transition-colors dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md">
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
};
// --- END MODAL COMPONENT ---

interface TaskCardProps {
  task: Task;
  updateTaskStatus: (id: string, newStatus: TaskStatus) => void;
  handleDeleteClick: (id: string) => void;
  isKanbanView?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  updateTaskStatus,
  handleDeleteClick,
  isKanbanView = false,
}) => {
  // Utility for status color
  const statusColor =
    task.status === "Completed"
      ? "text-green-500"
      : task.status === "In Progress"
      ? "text-yellow-500"
      : "text-red-500";

  const cardClasses = isKanbanView
    ? "bg-white dark:bg-zinc-700 p-3 rounded-lg shadow-md border-t-4 border-black dark:border-white transition-shadow hover:shadow-lg mb-3"
    : "flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white border border-black rounded-xl shadow-sm dark:bg-zinc-800 dark:border-zinc-700 transition-shadow hover:shadow-md";

  return (
    <li className={cardClasses}>
      <div
        className={`flex flex-col ${
          isKanbanView ? "mb-2" : "flex-grow mb-2 sm:mb-0"
        }`}>
        <span
          className={`text-lg font-medium ${
            task.status === "Completed"
              ? "line-through text-gray-500"
              : "text-black dark:text-white"
          } ${
            isKanbanView ? "text-base font-semibold" : "text-lg font-medium"
          }`}>
          {task.title}
        </span>
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 italic max-w-xl pr-4">
            {task.description}
          </p>
        )}
        <span
          className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
            isKanbanView ? "mt-2" : ""
          }`}>
          ID: {task.id} | Status:{" "}
          <span className={`font-semibold ${statusColor}`}>{task.status}</span>{" "}
          | Created: {formatTime(task.createdAt)}
        </span>
      </div>

      <div
        className={`flex items-center gap-2 ${
          isKanbanView ? "flex-wrap mt-2" : "mt-2 sm:mt-0"
        }`}>
        {/* === ACTION BUTTONS based on status === */}

        {/* A. If status is NOT STARTED */}
        {task.status === "Not Started" && (
          <>
            {/* Start (On-Going) Button */}
            <button
              onClick={() => updateTaskStatus(task.id, "In Progress")}
              title="Set to On-Going (In Progress)"
              className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-md">
              {/* Clock Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="13" r="8" />
                <path d="M12 9v5l3 3" />
                <path d="M5 20 2 17" />
                <path d="m22 7-3-3" />
              </svg>
            </button>
            {/* Mark Complete Button */}
            <button
              onClick={() => updateTaskStatus(task.id, "Completed")}
              title="Mark Complete"
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md">
              {/* Checkmark Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m9 11 3 3L22 4" />
              </svg>
            </button>
          </>
        )}

        {/* B. If status is IN PROGRESS */}
        {task.status === "In Progress" && (
          <>
            {/* Mark Complete Button */}
            <button
              onClick={() => updateTaskStatus(task.id, "Completed")}
              title="Mark Complete"
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md">
              {/* Checkmark Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m9 11 3 3L22 4" />
              </svg>
            </button>
          </>
        )}

        {/* C. If status is COMPLETED */}
        {task.status === "Completed" && (
          <>
            {/* Restart Button */}
            <button
              onClick={() => updateTaskStatus(task.id, "Not Started")}
              title="Restart Task (Set to Not Started)"
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md">
              {/* Reset/Restart Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M21.5 2v6H15" />
                <path d="M22 12a10 10 0 1 0-4.66 8.32" />
              </svg>
            </button>
          </>
        )}

        {/* Delete Button (Always Visible, Triggers Modal) */}
        <button
          onClick={() => handleDeleteClick(task.id)}
          title="Delete Task"
          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md">
          {/* Trash Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
    </li>
  );
};
// --- END TaskCard COMPONENT ---

// --- NEW COMPONENT: KanbanColumn ---
interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  updateTaskStatus: (id: string, newStatus: TaskStatus) => void;
  handleDeleteClick: (id: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  updateTaskStatus,
  handleDeleteClick,
}) => {
  let titleClasses = "";
  let headerBgClass = "";
  let columnClass = "";

  switch (status) {
    case "Not Started":
      titleClasses = "text-red-700 dark:text-red-400";
      headerBgClass = "bg-red-100 dark:bg-red-900/50";
      columnClass = "bg-red-300 dark:bg-red-900/50";
      break;
    case "In Progress":
      titleClasses = "text-yellow-700 dark:text-yellow-400";
      headerBgClass = "bg-yellow-100 dark:bg-yellow-900/50";
      columnClass = "bg-yellow-200 dark:bg-yellow-900/50";
      break;
    case "Completed":
      titleClasses = "text-green-700 dark:text-green-400";
      headerBgClass = "bg-green-100 dark:bg-green-900/50";
      columnClass = "bg-green-200 dark:bg-green-900/50";
      break;
  }

  return (
    <div
      className={`flex flex-col flex-shrink-0 w-full sm:w-[calc(33.333%-1rem)] max-w-full rounded-md ${columnClass}`}>
      <div
        className={`p-3 rounded-t-lg font-bold text-center mb-3 ${headerBgClass} border-b-4 border border-black dark:border-white`}>
        <h3 className={`text-xl ${titleClasses}`}>
          {status} ({tasks.length})
        </h3>
      </div>
      <div className="flex-grow space-y-3 p-1">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm italic">
            No tasks here.
          </p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                updateTaskStatus={updateTaskStatus}
                handleDeleteClick={handleDeleteClick}
                isKanbanView={true}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isStatsVisible, setIsStatsVisible] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [viewMode, setViewMode] = useState<"List" | "Kanban">("List"); // NEW STATE
  const [activeFilters, setActiveFilters] = useState<TaskStatus[]>([
    "Not Started",
    "In Progress",
    "Completed",
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
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
          description: newTaskDescription, // Default description
        }),
      });

      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const newTask: Task = await response.json();
      setTasks((prev) => [...prev, newTask]); // Add new task to state
      setNewTaskTitle("");
      setNewTaskDescription(""); // Clear inputs
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // 3. PUT /tasks/:id (Toggle Status)
  const updateTaskStatus = async (id: string, newStatus: TaskStatus) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to set status to ${newStatus}`);
      }

      // Update state immediately for better UX (optimistic update)
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setTaskToDeleteId(id);
    setIsModalOpen(true);
  };

  // 4. DELETE /tasks/:id
  const confirmedDeleteTask = async () => {
    if (!taskToDeleteId) return;

    try {
      const response = await fetch(`${API_URL}/${taskToDeleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Remove from local state
      setTasks((prev) => prev.filter((task) => task.id !== taskToDeleteId));

      // Close modal and reset ID
      setIsModalOpen(false);
      setTaskToDeleteId(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleFilter = (status: TaskStatus) => {
    setActiveFilters((prevFilters) => {
      if (prevFilters.includes(status)) {
        // Remove filter
        if (prevFilters.length === 1) return prevFilters; // Prevent removing the last filter
        return prevFilters.filter((f) => f !== status);
      } else {
        // Add filter
        return [...prevFilters, status];
      }
    });
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // --- Statistics Calculation ---
  const totalTasks = tasks.length;
  const notStartedTasks = tasks.filter(
    (t) => t.status === "Not Started"
  ).length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const onGoingTasks = tasks.filter((t) => t.status === "In Progress").length;
  const completedPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter the task list based on active filters
  const filteredTasks = tasks.filter((task) =>
    activeFilters.includes(task.status)
  );

  // Group tasks for Kanban view
  const tasksByStatus = {
    "Not Started": filteredTasks.filter((t) => t.status === "Not Started"),
    "In Progress": filteredTasks.filter((t) => t.status === "In Progress"),
    Completed: filteredTasks.filter((t) => t.status === "Completed"),
  };

  return (
    <main className="w-screen bg-orange-200">
      <div className="min-h-screen  container mx-auto p-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-black dark:text-white text-center">
          To-Do List
        </h1>

        {/* Basic Stat Display */}
        {isStatsVisible && (
          <div className="bg-white p-4  border border-black rounded-lg shadow-md mb-6 dark:bg-white-300">
            <h2 className="text-xl font-semibold text-black-800 dark:text-white-400 mb-2 text-center">
              Tasktistics
            </h2>
            <div className="grid grid-cols-4 gap-x-4 text-center">
              <div className="flex flex-col">
                <span className="font-bold">Total Tasks</span> {totalTasks}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-red-700">Not Started</span>{" "}
                {notStartedTasks}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-yellow-600">In Progress</span>{" "}
                {onGoingTasks}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-green-700">Completed</span>
                {completedTasks}&nbsp;(
                {completedPercentage}%)
              </div>
            </div>
          </div>
        )}

        {/* Toggle Button for Form */}

        <div className="flex flex-row gap-x-2 mb-4">
          <button
            onClick={() => {
              setViewMode(viewMode === "List" ? "Kanban" : "List");
              setIsFilterVisible(viewMode === "Kanban" ? true : false);
            }}
            title="Switch View Mode"
            className="bg-black text-white p-2 border border-black rounded-lg font-medium hover:bg-gray-700 transition-colors shadow-md flex items-center gap-2">
            {viewMode === "List" ? (
              <>
                {/* Kanban Board Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect width="7" height="10" x="3" y="3" rx="1" />
                  <rect width="7" height="10" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                </svg>
                Switch to Kanban
              </>
            ) : (
              <>
                {/* List Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="10" x2="21" y1="6" y2="6" />
                  <line x1="10" x2="21" y1="12" y2="12" />
                  <line x1="10" x2="21" y1="18" y2="18" />
                  <line x1="3" x2="3.01" y1="6" y2="6" />
                  <line x1="3" x2="3.01" y1="12" y2="12" />
                  <line x1="3" x2="3.01" y1="18" y2="18" />
                </svg>
                Switch to List
              </>
            )}
          </button>

          <button
            onClick={() => setIsStatsVisible((prev) => !prev)}
            title={isStatsVisible ? "Hide Statistics" : "Show Statistics"}
            className="bg-white text-gray-800 p-2 border border-black rounded-lg font-medium hover:bg-gray-300 transition-colors dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 shadow-md flex items-center gap-2">
            {/* Stats Icon (Bar Chart) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-4" />
            </svg>
            {isStatsVisible ? "Hide Stats" : "Show Stats"}
          </button>

          <button
            onClick={() => setIsFilterVisible((prev) => !prev)}
            title={isFilterVisible ? "Hide Filters" : "Show Filters"}
            className={`${
              viewMode === "Kanban" ? "hidden" : ""
            } bg-white text-gray-800 p-2 border border-black rounded-lg font-medium hover:bg-gray-300 transition-colors dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 shadow-md flex items-center gap-2`}>
            {/* Filter Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
          </button>

          <button
            onClick={() => setIsFormVisible((prev) => !prev)}
            className="bg-white text-gray-800 p-2 border border-black rounded-lg font-medium hover:bg-gray-300 transition-colors dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 shadow-md flex items-center gap-2">
            {isFormVisible ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Hide Add Task
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Add New Task
              </>
            )}
          </button>
        </div>

        {isFilterVisible && (
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-blackdark:border-zinc-700 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">
              Filter Tasks by Status:
            </h3>
            <div className="flex flex-wrap gap-2">
              {(
                ["Not Started", "In Progress", "Completed"] as TaskStatus[]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => toggleFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm
                  ${
                    activeFilters.includes(status)
                      ? "bg-black text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-700"
                  }`}>
                  {status} {activeFilters.includes(status) ? "✓" : ""}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
              Note: At least one status must be selected.
            </p>
          </div>
        )}
        {/* 3. CONDITIONAL RENDERING for Task Input Form */}
        {isFormVisible && (
          <div className="flex flex-col gap-3 mb-8 p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-black dark:border-zinc-700">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">
              Add New Task
            </h2>

            {/* Title Input */}
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task Title (Required)"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white dark:bg-zinc-800 dark:border-zinc-700"
            />

            {/* Description Textarea */}
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Task Description (Optional)"
              rows={3}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white dark:bg-zinc-800 dark:border-zinc-700 resize-none"
            />

            {/* Add Button */}
            <button
              onClick={addTask}
              className="bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-400 mt-2"
              disabled={!newTaskTitle.trim()}>
              Create Task
            </button>
          </div>
        )}
        {/* Conditional Rendering based on viewMode */}
        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
          {viewMode === "List" ? "List View" : "Kanban Board"}
        </h2>

        {loading && (
          <p className="text-center text-gray-500">Loading tasks...</p>
        )}

        {!loading && tasks.length === 0 && (
          <p className="text-center text-gray-500">
            No tasks found. Add a new one above!
          </p>
        )}

        {/* --- Kanban View --- */}
        {!loading && tasks.length > 0 && viewMode === "Kanban" && (
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 w-full overflow-x-auto p-2 bg-white border border-black rounded-md">
            {(["Not Started", "In Progress", "Completed"] as TaskStatus[]).map(
              (status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tasks={tasksByStatus[status]}
                  updateTaskStatus={updateTaskStatus}
                  handleDeleteClick={handleDeleteClick}
                />
              )
            )}
          </div>
        )}

        {/* --- List View (Original) --- */}
        {!loading && tasks.length > 0 && viewMode === "List" && (
          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                updateTaskStatus={updateTaskStatus}
                handleDeleteClick={handleDeleteClick}
                isKanbanView={false}
              />
            ))}
          </ul>
        )}

        {/* Render the Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmedDeleteTask}
          taskId={taskToDeleteId}
        />
      </div>
    </main>
  );
}
