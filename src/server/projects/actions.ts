import {
  CreateProject,
  DeleteProject,
  UpdateProject,
  CreateProjectGroup,
  UpdateProjectGroup,
  DeleteProjectGroup,
} from "@wasp/actions/types";
import HttpError from "@wasp/core/HttpError.js";
import { Project, ProjectGroup } from "@wasp/entities";

type CreateProjectArgs = Pick<Project, "companyId" | "name">;

export const createProject: CreateProject<CreateProjectArgs, Project> = (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  console.log(args);

  return context.entities.Project.create({
    data: {
      name: args.name,
      company: { connect: { id: args.companyId!! } },
    },
  });
};

type UpdateProjectArgs = Pick<Project, "name" | "companyId" | "id">;

export const updateProject: UpdateProject<UpdateProjectArgs, Project> = (
  { name, companyId, id },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Project.update({
    where: {
      id,
    },
    data: { name, company: { connect: { id: companyId!! } } },
  });
};

type DeleteProjectArgs = Pick<Project, "name" | "companyId" | "id">;

export const deleteProject: DeleteProject<DeleteProjectArgs, Project> = (
  { id },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Project.delete({ where: { id } });
};

type CreateProjectGroupArgs = Pick<ProjectGroup, "name" | "companyId">;

export const createProjectGroup: CreateProjectGroup<
  CreateProjectGroupArgs,
  ProjectGroup
> = ({ companyId, name }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.ProjectGroup.create({
    data: {
      name,
      company: { connect: { id: companyId!! } },
    },
  });
};

type UpdateProjectGroupArgs = Pick<ProjectGroup, "name" | "companyId" | "id">;

export const updateProjectGroup: UpdateProjectGroup<
  UpdateProjectGroupArgs,
  ProjectGroup
> = ({ name, companyId, id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.ProjectGroup.update({
    where: {
      id,
    },
    data: { name, company: { connect: { id: companyId!! } } },
  });
};

type DeleteProjectGroupArgs = Pick<ProjectGroup, "id">;

export const deleteProjectGroup: DeleteProjectGroup<
  DeleteProjectGroupArgs,
  ProjectGroup
> = ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.ProjectGroup.delete({ where: { id } });
};
