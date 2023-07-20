import React, { useState } from "react";
import "./Main.css";
import { useQuery } from "@wasp/queries";
import getFilteredTasks from "@wasp/queries/getFilteredTasks";
import getCompanyIds from "@wasp/queries/getCompanyIds";
import getUserIds from "@wasp/queries/getUserIds";
import createCompany from "@wasp/actions/createCompany";
import { FilterSet } from "../../.wasp/out/server/src/shared/types";
import { HeaderList } from "./components/Headers/HeaderList";
import { CompanyData, ProjectData } from "./components/Headers/HeaderList";
import { TaskData } from "./components/Tasks/TaskItem";
import {
  FaPlus,
  FaFilter,
  FaTimes,
  FaChevronRight,
  FaUser,
} from "react-icons/fa";
import {
  Autocomplete,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { User } from "@wasp/entities";
import logout from "@wasp/auth/logout";
import logo from "./static/zai_logo2023_wht_600px_trans.png";
import { ChangePasswordModal } from "./components/Modals/ChangePasswordModal";

export type ItemData = CompanyData | ProjectData | TaskData | undefined;

const DRAWER_W = 200;

const statuses = [
  { val: 0, label: "Incomplete" },
  { val: 1, label: "Inactive" },
  { val: 2, label: "Complete" },
  { val: 3, label: "Archived" },
];

const emptyFilters = {
  companyIds: [],
  userIds: [],
  status: [],
};

export interface PageAlert {
  message: string;
  severity: "success" | "warning" | "error" | "info";
}

export function MainPage({ user }: { user: User }) {
  const [filteredCompanies, setFilteredCompanies] = useState<
    { name: string; id: string }[]
  >([]);
  const [filteredEmployees, setFilteredEmployees] = useState<
    { username: string; id: string }[]
  >([]);
  const [filteredStatuses, setFilteredStatuses] = useState<number[]>([]);
  const [itemBeingEdited, setItemBeingEdited] = useState<ItemData>(undefined);
  const [appliedFilters, setAppliedFilters] = useState<FilterSet>(emptyFilters);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [newCompany, setNewCompany] = useState<CompanyData | undefined>(
    undefined
  );
  const [alert, setAlert] = useState<PageAlert>();
  const [taskKeyword, setTaskKeyword] = useState<string>();

  React.useEffect(() => {
    if (document && document !== null) {
      document.querySelector("html")?.setAttribute("data-theme", "zanthic");
    }
  }, []);

  React.useEffect(() => {
    if (!itemBeingEdited) {
      setNewCompany(undefined);
    }
  }, [itemBeingEdited]);

  const changePasswordModalRef = React.useRef<HTMLDialogElement>();

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

  const {
    data: filteredCompanyData,
    isFetching: isFetchingFilteredTasks,
    error: filterdTasksError,
  } = useQuery(getFilteredTasks, appliedFilters);

  const applyFilters = () => {
    setAppliedFilters({
      companyIds: filteredCompanies.map((c) => c.id),
      userIds: filteredEmployees.map((e) => e.id),
      status: filteredStatuses,
    });
  };

  const clearFilters = () => {
    setFilteredCompanies([]);
    setFilteredEmployees([]);
    setFilteredStatuses([]);
    setAppliedFilters(emptyFilters);
  };

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

  const onAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    let _newCompany = {
      id: "new",
      name: `New Company`,
      createdAt: new Date(),
      projects: [],
    };

    setNewCompany(_newCompany);
    setItemBeingEdited(_newCompany);
  };

  const onSave = async (
    e?: React.MouseEvent<HTMLButtonElement>,
    childName?: string
  ) => {
    if (e) e.stopPropagation();
    if (childName) {
      await createCompany({ name: childName });
    }

    setItemBeingEdited(undefined);
    setAlert({
      severity: "success",
      message: `Added new company: ${childName}`,
    });
    setNewCompany(undefined);
  };

  const onCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.stopPropagation();
    setItemBeingEdited(undefined);
    setNewCompany(undefined);
  };

  return (
    <main>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={!!alert}
        autoHideDuration={5000}
        onClose={() => setAlert(undefined)}
      >
        <Alert
          severity={alert?.severity}
          className="cursor-pointer"
          onClick={() => setAlert(undefined)}
        >
          <div className="flex items-center gap-3">
            {alert?.message}
            <FaTimes />
          </div>
        </Alert>
      </Snackbar>
      <div
        className="transition-all duration-500"
        style={{ width: showFilters ? window.innerWidth - DRAWER_W : "100%" }}
      >
        <nav className="sticky top-0 w-full items-center z-20 flex py-4 pl-10 pr-7 bg-primary justify-between">
          <dialog className="modal" ref={changePasswordModalRef as any}>
            <ChangePasswordModal />
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
          <img src={logo} className="w-72" />
          <div className="text-3xl text-secondary items-center">
            Project Manager
          </div>
          <div className="flex items-center gap-5">
            <div className="dropdown dropdown-hover px-5">
              <label
                tabIndex={0}
                style={{ listStyle: "none" }}
                className="text-secondary p-2"
              >
                <FaUser size={20} />
              </label>
              <ul
                tabIndex={0}
                className="text-neutral p-2 shadow dropdown-content bg-secondary z-[10] rounded-box w-52"
              >
                <li className="border-b-[2px] hover:bg-secondary p-2">
                  <span>Logged in as {user.username}</span>
                </li>
                <li
                  className="rounded-b-md flex"
                  onClick={() => changePasswordModalRef.current?.showModal()}
                >
                  <span className="p-2 btn-ghost cursor-pointer h-full w-[100%]">
                    Change Password
                  </span>
                </li>
                <li
                  className="p-2 btn-ghost cursor-pointer rounded-b-md"
                  onClick={logout}
                >
                  <a>Logout</a>
                </li>
              </ul>
            </div>
            <button
              onClick={onAdd}
              className="flex items-center text-secondary gap-2 hover:text-accent"
            >
              <FaPlus />
              <span>New Company</span>
            </button>
            <div className="flex items-center">
              <button
                className="pl text-secondary py-2 pl-5 hover:text-accent"
                onClick={() => setShowFilters(!showFilters)}
              >
                {!showFilters ? (
                  <FaFilter size={20} />
                ) : (
                  <FaChevronRight size={20} />
                )}
              </button>
            </div>
          </div>
        </nav>
        <div className="container mx-auto border-t-2 py-5">
          {isFetchingFilteredTasks ||
            isFetchingCompanyIds ||
            (isFetchingUserIds && (
              <div className="flex justify-center">
                <CircularProgress />
              </div>
            ))}
          {newCompany && (
            <HeaderList<CompanyData, TaskData>
              data={newCompany as CompanyData}
              setAlert={setAlert}
              parentOnSave={onSave}
              parentOnCancel={onCancel}
              headerType="company"
              itemBeingEdited={itemBeingEdited}
              setItemBeingEdited={setItemBeingEdited}
            />
          )}
          {filteredCompanyData?.map((c) => (
            <HeaderList<CompanyData, ProjectData>
              setAlert={setAlert}
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
              onChange={(_, newVal) => setFilteredCompanies(newVal)}
              value={filteredCompanies}
              options={companyIds}
              disableCloseOnSelect
              getOptionLabel={(c) => c.name}
              renderOption={(props, option, { selected }) => (
                <li {...props} className="flex gap-2 my-2 mx-3 items-center">
                  <input
                    type="checkbox"
                    checked={selected}
                    className="checkbox checkbox-info"
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
              onChange={(_, newVal) => setFilteredEmployees(newVal)}
              value={filteredEmployees}
              disableCloseOnSelect
              getOptionLabel={(u) => u.username}
              renderOption={(props, option, { selected }) => (
                <li {...props} className="flex gap-2 my-2 mx-3 items-center">
                  <input
                    type="checkbox"
                    checked={selected}
                    className="checkbox checkbox-info"
                  />
                  {option.username}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Assignees" />
              )}
            />
          )}
          <div className="flex flex-col p-2 border-2 gap-2 text-neutral">
            {statuses.map((s) => (
              <div key={s.val} className="flex gap-2">
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
                  className="checkbox checkbox-info"
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
          <div className="flex flex-col gap-2">
            <button
              onClick={applyFilters}
              className="btn btn-primary text-secondary"
            >
              Apply
            </button>
            <button
              onClick={clearFilters}
              className="btn btn-ghost text-neutral"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
