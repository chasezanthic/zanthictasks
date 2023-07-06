import React, { useState, useEffect } from "react";
import "./Main.css";
import { useQuery } from "@wasp/queries";
import getFilteredTasks from "@wasp/queries/getFilteredTasks";
import getCompanyIds from "@wasp/queries/getCompanyIds";
import getUserIds from "@wasp/queries/getUserIds";
import getAllTasks from "@wasp/queries/getAllTasks";
import { FilterSet } from "../../.wasp/out/server/src/shared/types";
import { HeaderList } from "./components/Headers/HeaderList";
import { CompanyData, ProjectData } from "./components/Headers/HeaderList";
import { TaskData } from "./components/Tasks/TaskItem";
import { FaPlus, FaFilter, FaChevronRight, FaTimes } from "react-icons/fa";
import { Autocomplete } from "@mui/material";

export type ItemData = CompanyData | ProjectData | TaskData | undefined;

const DRAWER_W = 15;

export function MainPage() {
  const [filteredCompanies, setFilteredCompanies] = useState<number[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<number[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<number[]>([]);
  const [itemBeingEdited, setItemBeingEdited] = useState<ItemData>(undefined);
  const [showFilters, setShowFilters] = useState<boolean>(false);

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

  return (
    <main className="flex">
      <div
        className="flex-1"
        style={{ width: showFilters ? `${100 - DRAWER_W}%` : "100%" }}
      >
        <nav className="sticky top-0 w-full z-20 flex py-7 pl-10 pr-7 bg-[#07223D] justify-between">
          <h1 className="text-center text-white text-3xl">Zanthic Tasks</h1>
          <div className="flex items-center">
            <button className="flex items-center text-white gap-2 hover:text-blue-300 pr-5">
              <FaPlus />
              <span>New Company</span>
            </button>
            <div className="flex items-center">
              {!showFilters && (
                <button
                  className="border-l-2 pl text-white py-2 pl-5 hover:text-blue-300"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter />
                </button>
              )}
            </div>
          </div>
        </nav>
        <div className="container mx-auto border-t-2">
          {companies?.map((c) => (
            <HeaderList<CompanyData, ProjectData>
              key={c.id}
              headerType="company"
              children={c.projects}
              setItemBeingEdited={setItemBeingEdited}
              itemBeingEdited={itemBeingEdited}
              data={c}
            />
          ))}
        </div>
      </div>
      <div
        className="transition-all border-l-2 relative"
        style={{ width: showFilters ? `${DRAWER_W}%` : 0 }}
      >
        <div>
          <button
            className="absolute top-3 left-3"
            onClick={() => setShowFilters(false)}
          >
            <FaTimes size={20} />
          </button>
          <p className="w-full text-center p-3">Manage Filters</p>
          {/* <Autocomplete multiple /> */}
        </div>
      </div>
    </main>
  );
}
