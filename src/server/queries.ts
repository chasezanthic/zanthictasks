import HttpError from "@wasp/core/HttpError.js";
import type {
  GetFilteredTasks,
  GetCompanyIds,
  GetUserIds,
  GetAllTasks,
  GetAssigneeNames,
} from "@wasp/queries/types";
import type { FilterSet } from "../shared/types";
import { User } from "@wasp/entities";

export const getAllTasks = (async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Company.findMany({
    include: {
      projects: {
        include: {
          tasks: {
            include: {
              assigned: {
                include: {
                  user: {
                    select: {
                      username: true,
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
}) satisfies GetAllTasks;

export const getFilteredTasks = (async (filters: FilterSet, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Company.findMany({
    where: {
      id: {
        in: filters.companyIds,
      },
      projects: {
        some: {
          tasks: {
            some: {
              status: { in: filters.status },
              assigned: {
                some: {
                  userId: {
                    in: filters.userIds,
                  },
                },
              },
            },
          },
        },
      },
    },
    include: {
      projects: {
        include: {
          tasks: {
            where: {
              AND: [{ NOT: { status: 0 } }, { status: { in: filters.status } }],
            },
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
