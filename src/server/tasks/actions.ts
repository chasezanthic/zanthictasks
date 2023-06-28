import {
  AssignToTask,
  CreateTask,
  DeleteTask,
  UpdateTask,
} from "@wasp/actions/types";
import HttpError from "@wasp/core/HttpError.js";
import { Task, TaskAssignment } from "@wasp/entities";

type CreateTaskArgs = Pick<Task, "description" | "projectId">;

export const createTask: CreateTask<CreateTaskArgs, Task> = async (
  { description, projectId },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Task.create({
    data: {
      project: { connect: { id: projectId } },
      description,
      status: 0,
    },
  });
};

export const assignToTask: AssignToTask<TaskAssignment, TaskAssignment> = (
  { taskId, userId },
  context
) => {
  if (!context.user || !context.user) {
    throw new HttpError(401);
  }

  return context.entities.TaskAssignment.create({
    data: {
      task: { connect: { id: taskId } },
      user: { connect: { id: userId } },
    },
  });
};

export const removeFromTask: AssignToTask<TaskAssignment, TaskAssignment> = (
  { taskId, userId },
  context
) => {
  if (!context.user || !context.user) {
    throw new HttpError(401);
  }

  return context.entities.TaskAssignment.delete({
    where: {
      taskId_userId: {
        taskId: taskId,
        userId: userId,
      },
    },
  });
};

type UpdateTaskArgs = Pick<Task, "id" | "status" | "description" | "projectId">;

export const updateTask: UpdateTask<UpdateTaskArgs, Task> = (
  { id, status, description, projectId },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Task.update({
    where: {
      id,
    },
    data: { status, description, project: { connect: { id: projectId } } },
  });
};

type DeleteTaskArgs = Pick<Task, "id">;

export const deleteTask: DeleteTask<DeleteTaskArgs, void> = async (
  { id },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  await context.entities.Task.delete({ where: { id } });
};
