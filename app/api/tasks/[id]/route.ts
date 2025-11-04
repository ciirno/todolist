/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateTask, deleteTask } from "@/lib/task-db";
import { TaskStatus } from "@/types/task";

// 3. PUT /tasks/:id (Updates a task, e.g., mark as completed)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Correctly defining the required 'params' structure
): Promise<NextResponse> {
  const { id } = await params;
  try {
    const body = await request.json();
    const { status } = body; // You might update title, description, or status

    // Simple validation to ensure 'status' is a known type
    const validStatuses: TaskStatus[] = [
      "Not Started",
      "In Progress",
      "Completed",
    ];
    if (status && !validStatuses.includes(status)) {
      return new NextResponse("Invalid status value.", { status: 400 });
    }

    const updated = updateTask(id, body);

    if (!updated) {
      return new NextResponse("Task not found", { status: 404 });
    }

    return NextResponse.json({ message: `Task ${id} updated successfully` });
  } catch (error) {
    return new NextResponse("Invalid request body or server error", {
      status: 400,
    });
  }
}

// 4. DELETE /tasks/:id (Deletes a task)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Correctly defining the required 'params' structure
): Promise<NextResponse> {
  const { id } = await params;
  const wasDeleted = deleteTask(id);

  if (!wasDeleted) {
    return new NextResponse("Task not found", { status: 404 });
  }

  // 204 No Content is the standard response for a successful DELETE
  return new NextResponse(null, { status: 204 });
}
