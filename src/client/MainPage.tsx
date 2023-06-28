import React, { useState, useEffect } from "react";
import "./Main.css";
import { useQuery } from "@wasp/queries";
import getFilteredTasks from "@wasp/queries/getFilteredTasks";
import getCompanyIds from "@wasp/queries/getCompanyIds";
import getUserIds from "@wasp/queries/getUserIds";
import getAllTasks from "@wasp/queries/getAllTasks";
import { FilterSet } from "../../.wasp/out/server/src/shared/types";
import { FaChevronDown } from "react-icons/fa";
import { CompanyItem } from "./components/CompanyItem";

export function MainPage() {
  const [filteredCompanies, setFilteredCompanies] = useState<number[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<number[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<number[]>([]);
  const [openedCompanies, setOpenedCompanies] = useState<number[]>([]);
  const [editingCompany, setEditingCompany] = useState<number>();

  const {
    data: companies,
    isFetching: isFetchingTasks,
    error: tasksError,
  } = useQuery(getAllTasks);

  const {
    data: companyIds,
    isFetching: isFetchingCompanyIds,
    error: companyIdsError,
  } = useQuery(getCompanyIds);

  const {
    data: userIds,
    isFetching: isFetchingUserIds,
    error: userIdsError,
  } = useQuery(getUserIds);

  const getFilters = () => {
    const filters: FilterSet = {
      companyIds: [],
      userIds: [],
      status: [],
    };

    if (filteredCompanies.length == 0 && companyIds) {
      filters.companyIds = companyIds.map((c) => c.id);
    }

    if (filteredEmployees.length == 0 && userIds) {
      filters.userIds = userIds.map((c) => c.id);
    }

    return filters;
  };

  const {
    data: filteredCompanyData,
    isFetching: isFetchingFilteredTasks,
    error: filterdTasksError,
  } = useQuery(getFilteredTasks, getFilters());

  useEffect(() => {
    console.log(companyIds);
  }, [isFetchingCompanyIds]);

  useEffect(() => {
    console.log(companies);
  }, [isFetchingTasks]);

  console.log(companies?.at(0)?.projects);

  return (
    <main>
      <h1 className="my-10 text-center text-4xl">Zanthic Tasks</h1>
      <div className="container mx-auto">
        {companies?.map((c) => (
          <CompanyItem
            openedCompanies={openedCompanies}
            setOpenedCompanies={setOpenedCompanies}
            setEditingCompany={setEditingCompany}
            editingCompany={editingCompany}
            key={c.id}
            c={c}
          />
        ))}
      </div>
    </main>
  );
}
