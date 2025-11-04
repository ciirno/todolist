// src/app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { getTasks, createTask } from "@/lib/task-db";

// 1. GET /tasks (Returns a list of tasks)
export async function GET() {
  try {
    const tasks = getTasks();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error reading tasks:", error);
    return NextResponse.json(
      { message: "Failed to read tasks." },
      { status: 500 }
    );
  }
}
// 2. POST /tasks (Adds a new task)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { message: "Title is required and must be a string." },
        { status: 400 }
      );
    }

    const newTask = createTask(title, description || "");
    console.log("✅ Created task:", newTask);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { message: "Failed to create task." },
      { status: 500 }
    );
  }
}
