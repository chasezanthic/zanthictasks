import {
  CreateCompany,
  DeleteCompany,
  UpdateCompany,
} from "@wasp/actions/types";
import HttpError from "@wasp/core/HttpError.js";
import { Company } from "@wasp/entities";

type CreateCompanyArgs = Pick<Company, "name">;

export const createCompany: CreateCompany<CreateCompanyArgs, Company> = (
  { name },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Company.create({
    data: {
      name: name,
    },
  });
};

type UpdateCompanyArgs = Pick<Company, "id" | "name">;

export const updateCompany: UpdateCompany<UpdateCompanyArgs, Company> = (
  { id, name },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Company.update({
    where: {
      id,
    },
    data: { name },
  });
};

type DeleteCompanyArgs = Pick<Company, "id">;

export const deleteCompany: DeleteCompany<DeleteCompanyArgs, Company> = (
  { id },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Company.delete({ where: { id } });
};
