import HttpError from "@wasp/core/HttpError.js";
import type {
  GetFilteredTasks,
  GetCompanyIds,
  GetUserIds,
  GetAssigneeNames,
  GetProjectIds,
} from "@wasp/queries/types";
import type { FilterSet } from "../shared/types";
import { User } from "@wasp/entities";

export const getFilteredTasks = (async (filters: FilterSet, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const companies = await context.entities.Company.findMany({
    where: {
      id:
        filters.companyIds.length > 0
          ? {
              in: filters.companyIds,
            }
          : {},
      projects:
        filters.userIds.length > 0 || filters.status.length > 0
          ? {
              some: {
                tasks: {
                  some: {
                    status:
                      filters.status.length > 0 ? { in: filters.status } : {},
                    assigned:
                      filters.userIds.length > 0
                        ? {
                            some: {
                              userId: {
                                in: filters.userIds,
                              },
                            },
                          }
                        : {},
                  },
                },
              },
            }
          : {},
    },
    include: {
      projects: {
        where:
          filters.userIds.length > 0 || filters.status.length > 0
            ? {
                tasks: {
                  some: {
                    status:
                      filters.status.length > 0 ? { in: filters.status } : {},
                    assigned:
                      filters.userIds.length > 0
                        ? {
                            some: {
                              userId: {
                                in: filters.userIds,
                              },
                            },
                          }
                        : {},
                  },
                },
              }
            : {},
        include: {
          tasks: {
            where:
              filters.userIds.length > 0 || filters.status.length > 0
                ? {
                    status:
                      filters.status.length > 0 ? { in: filters.status } : {},
                    assigned:
                      filters.userIds.length > 0
                        ? {
                            some: {
                              userId: {
                                in: filters.userIds,
                              },
                            },
                          }
                        : {},
                  }
                : {},
            include: {
              assigned: {
                include: {
                  user: {
                    select: {
                      username: true,
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return companies;
}) satisfies GetFilteredTasks;

export const getCompanyIds = (async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Company.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}) satisfies GetCompanyIds;

export const getProjectIds = (async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Project.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}) satisfies GetProjectIds;

export const getUserIds = (async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.findMany({
    select: {
      id: true,
      username: true,
    },
  });
}) satisfies GetUserIds;

export const getAssigneeNames: GetAssigneeNames<
  string[],
  Pick<User, "id" | "username">[]
> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.findMany({
    select: {
      id: true,
      username: true,
    },
  });
};
