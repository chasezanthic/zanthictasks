import {
  AssignToTask,
  CreateTask,
  DeleteTask,
  UpdateTask,
  UpdateAssignees,
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
      project: { connect: { id: projectId ?? undefined } },
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
    data: {
      status,
      description,
      project: { connect: { id: projectId ?? undefined } },
    },
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

type UpdateAssigneesArgs = {
  taskId: string;
  addedAssigneeIds: string[];
  deletedAssigneeIds: string[];
};

export const updateAssignees: UpdateAssignees<
  UpdateAssigneesArgs,
  void
> = async ({ taskId, addedAssigneeIds, deletedAssigneeIds }, context) => {
  if (deletedAssigneeIds.length > 0) {
    await context.entities.TaskAssignment.deleteMany({
      where: {
        AND: [{ taskId: taskId }, { userId: { in: deletedAssigneeIds } }],
      },
    });
  }

  for (const id of addedAssigneeIds) {
    await context.entities.TaskAssignment.create({
      data: {
        userId: id,
        taskId: taskId,
      },
    });
  }
};
