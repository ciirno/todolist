// src/app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { getTasks, createTask } from "@/lib/task-db";

// 1. GET /tasks (Returns a list of tasks)
export async function GET() {
  const tasks = getTasks();
  return NextResponse.json(tasks);
}

// 2. POST /tasks (Adds a new task)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const newTask = createTask(title, description || "");

    console.log(newTask);
    // 💡 FIX/CHECK: Ensure status 201 (Created) is explicitly set here
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Server-side error during POST:", error);
    // Return a 500 or 400 if parsing or other server error occurs
    return new NextResponse("Invalid request body or internal error", {
      status: 400,
    });
  }
}
