import { Company, Project } from "@wasp/entities";

export type UpdateProjectArgs = Pick<Project, "name" | "companyId" | "id">;
export type UpdateCompanyArgs = Pick<Company, "name" | "id">;
export type FilterSet = {
  companyIds: string[];
  userIds: string[];
  status: number[];
};
