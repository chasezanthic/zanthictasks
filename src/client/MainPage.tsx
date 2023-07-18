import React, { useState } from "react";
import "./Main.css";
import { useQuery } from "@wasp/queries";
import getFilteredTasks from "@wasp/queries/getFilteredTasks";
import getCompanyIds from "@wasp/queries/getCompanyIds";
import getProjectIds from "@wasp/queries/getProjectIds";
import getUserIds from "@wasp/queries/getUserIds";
import getAllTasks from "@wasp/queries/getAllTasks";
import { FilterSet } from "../../.wasp/out/server/src/shared/types";
import { HeaderList } from "./components/Headers/HeaderList";
import { CompanyData, ProjectData } from "./components/Headers/HeaderList";
import { TaskData } from "./components/Tasks/TaskItem";
import { FaPlus, FaFilter, FaTimes, FaChevronRight } from "react-icons/fa";
import { Autocomplete, TextField } from "@mui/material";
import { User } from "@wasp/entities";
import logout from "@wasp/auth/logout";
import logo from "./static/zai_logo2023_wht_600px_trans.png";

export type ItemData = CompanyData | ProjectData | TaskData | undefined;

const DRAWER_W = 200;

const statuses = [
  { val: 0, label: "Incomplete" },
  { val: 1, label: "Inactive" },
  { val: 2, label: "Complete" },
  { val: 3, label: "Archived" },
];

export function MainPage({ user }: { user: User }) {
  const [filteredCompanies, setFilteredCompanies] = useState<string[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<string[]>([]);
  const [filteredProjects, setfilteredProjects] = useState<string[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<number[]>([]);
  const [itemBeingEdited, setItemBeingEdited] = useState<ItemData>(undefined);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [taskKeyword, setTaskKeyword] = useState<string>();

  React.useEffect(() => {
    if (document && document !== null) {
      document.querySelector("html")?.setAttribute("data-theme", "zanthic");
    }
  }, []);

  const {
    data: fullCompanies,
    isFetching: isFetchingTasks,
    error: tasksError,
  } = useQuery(getAllTasks);

  const {
    data: companyIds,
    isFetching: isFetchingCompanyIds,
    error: companyIdsError,
  } = useQuery(getCompanyIds);

  const {
    data: projectIds,
    isFetching: isFetchingProjectIds,
    error: projectIdsError,
  } = useQuery(getProjectIds);

  const {
    data: userIds,
    isFetching: isFetchingUserIds,
    error: userIdsError,
  } = useQuery(getUserIds);

  const getFilters = () => {
    if (companyIds && userIds) {
      const filters: FilterSet = {
        companyIds:
          filteredCompanies.length > 0
            ? filteredCompanies
            : companyIds?.map((c) => c.id),
        userIds:
          filteredEmployees.length > 0
            ? filteredEmployees
            : userIds?.map((c) => c.id),
        status:
          filteredStatuses.length > 0
            ? filteredStatuses
            : statuses?.map((c) => c.val),
      };
      return filters;
    }

    return undefined;
  };

  const {
    data: filteredCompanyData,
    isFetching: isFetchingFilteredTasks,
    error: filterdTasksError,
  } = useQuery(getFilteredTasks, getFilters(), { enabled: !!getFilters() });

  function toggleValue<TVal>(
    val: TVal,
    toggle: (newList: TVal[]) => void,
    list: TVal[]
  ) {
    if (list.includes(val)) {
      toggle(list.filter((s) => s !== val));
    } else {
      toggle([...list, val]);
    }
  }

  console.log(getFilters());
  console.log(filteredCompanyData);

  if (fullCompanies && filteredCompanyData) {
    const interesection = fullCompanies
      .map((c) => c.name)
      .filter((el) => !filteredCompanyData.map((c) => c.name).includes(el));

    console.log(interesection);
  }

  return (
    <main>
      <div
        className="transition-all duration-500"
        style={{ width: showFilters ? window.innerWidth - DRAWER_W : "100%" }}
      >
        <nav className="sticky top-0 w-full z-20 flex py-7 pl-10 pr-7 bg-primary justify-between">
          <img src={logo} className="w-52" />
          {/* <h1 className="text-center text-secondary text-3xl">Zanthic Tasks</h1> */}
          <div className="flex items-center gap-5">
            <button className="flex items-center text-secondary gap-2 hover:text-accent pr-5">
              <FaPlus />
              <span>New Company</span>
            </button>
            <details className="dropdown dropdown-end">
              <summary className="avatar placeholder cursor-pointer">
                <div className="bg-neutral text-secondary hover:bg-slate-700 rounded-full w-10 border-[1px]">
                  <span>{user.username.at(0)}</span>
                </div>
              </summary>
              <ul className="text-neutral p-2 shadow dropdown-content bg-secondary z-[1] rounded-box w-52 mt-2">
                <li className="border-b-[2px] hover:bg-secondary p-2">
                  <span>Logged in as {user.username}</span>
                </li>
                <li
                  className="p-2 btn-ghost cursor-pointer rounded-b-md"
                  onClick={logout}
                >
                  <a>Logout</a>
                </li>
              </ul>
            </details>
            <div className="flex items-center">
              <button
                className="pl text-secondary py-2 pl-5 hover:text-accent"
                onClick={() => setShowFilters(!showFilters)}
              >
                {!showFilters ? <FaFilter /> : <FaChevronRight />}
              </button>
            </div>
          </div>
        </nav>
        <div className="container mx-auto border-t-2">
          {filteredCompanyData?.map((c) => (
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
        className="transition-all border-l-2 fixed top-0 right-0 h-full duration-500"
        style={{
          width: showFilters ? DRAWER_W : 0,
        }}
      >
        <div className="flex items-center h-10 justify-start px-2 bg-primary py-7">
          <button
            className="text-secondary"
            onClick={() => setShowFilters(false)}
          >
            <FaTimes size={20} />
          </button>
          <p className="text-secondary text-center pl-4 whitespace-nowrap">
            Manage Filters
          </p>
        </div>
        <div className="p-3 flex flex-col gap-5">
          {companyIds && (
            <Autocomplete
              multiple
              onChange={(_, newVal) =>
                setFilteredCompanies(newVal.map((c) => c.id))
              }
              options={companyIds}
              disableCloseOnSelect
              getOptionLabel={(c) => c.name}
              renderOption={(props, option, { selected }) => (
                <li {...props} className="flex gap-2 my-2 mx-3 items-center">
                  <input
                    type="checkbox"
                    checked={selected}
                    className="checkbox"
                  />
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Companies" />
              )}
            />
          )}
          {/* {projectIds && (
            <Autocomplete
              multiple
              onChange={(_, newVal) =>
                setfilteredProjects(newVal.map((p) => p.id))
              }
              options={projectIds}
              disableCloseOnSelect
              getOptionLabel={(p) => p.name}
              renderOption={(props, option, { selected }) => (
                <li {...props} className="flex gap-2 my-2 mx-3 items-center">
                  <input
                    type="checkbox"
                    checked={filteredProjects.includes(option.id)}
                    className="checkbox"
                  />
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Projects" />
              )}
            />
          )} */}
          {userIds && (
            <Autocomplete
              multiple
              options={userIds}
              onChange={(_, newVal) =>
                setFilteredEmployees(newVal.map((p) => p.id))
              }
              disableCloseOnSelect
              getOptionLabel={(u) => u.username}
              renderOption={(props, option, { selected }) => (
                <li {...props} className="flex gap-2 my-2 mx-3 items-center">
                  <input
                    type="checkbox"
                    checked={selected}
                    className="checkbox"
                  />
                  {option.username}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Assignees" />
              )}
            />
          )}
          <div className="flex flex-col p-2 border-2 gap-2">
            {statuses.map((s) => (
              <div className="flex gap-2">
                <input
                  onChange={() =>
                    toggleValue<number>(
                      s.val,
                      setFilteredStatuses,
                      filteredStatuses
                    )
                  }
                  type="checkbox"
                  checked={filteredStatuses.includes(s.val)}
                  className="checkbox"
                />
                {s.label}
              </div>
            ))}
          </div>
          {/* <input
            value={taskKeyword}
            onChange={(e) => setTaskKeyword(e.target.value)}
            type="text"
            className="border-2 p-2 rounded-md"
            placeholder="Task keywords"
          /> */}
          {/* <button className="btn">Clear</button> */}
        </div>
      </div>
    </main>
  );
}
