import React, { useState, useRef, useEffect } from "react";
import { Company, Project, Task, TaskAssignment } from "@wasp/entities";
import updateCompany from "@wasp/actions/updateCompany";
import createTask from "@wasp/actions/createTask";
import updateProject from "@wasp/actions/updateProject";
import deleteCompany from "@wasp/actions/deleteCompany";
import deleteProject from "@wasp/actions/deleteProject";
import { FaEdit } from "react-icons/fa";
import { HeaderActions } from "./HeaderActions";
import { TaskData, TaskItem } from "../Tasks/TaskItem";
import { EditableText } from "../Shared/EditableText";
import { ItemData } from "../../MainPage";
import { Listbox } from "@headlessui/react";
import { NewTaskModal } from "../Modals/NewTaskModal";

export type CompanyData = Company & {
  projects: ProjectData[];
};

export type ProjectData = Project & {
  tasks: TaskData[];
};

interface HeaderListProps<
  T extends CompanyData | ProjectData,
  TChild extends ProjectData | TaskData
> {
  data: T;
  children?: TChild[];
  itemBeingEdited?: ItemData;
  setItemBeingEdited: (state?: ItemData) => void;
  headerType: "company" | "project";
}

export const HeaderList = <
  T extends CompanyData | ProjectData,
  TChild extends ProjectData | TaskData
>({
  data,
  itemBeingEdited,
  setItemBeingEdited,
  headerType,
  children,
}: HeaderListProps<T, TChild>) => {
  const [name, setName] = useState<string | undefined>(data?.name);
  const [hovering, setHovering] = useState(false);
  const [newHeader, setNewHeader] = useState<T | undefined>(undefined);
  const [newTask, setNewTask] = useState<Task | undefined>(undefined);

  const itemEditedIdRef = useRef<string | undefined>();

  const deleteModalRef = useRef<HTMLDialogElement>();
  const collapseRef = useRef<HTMLInputElement>();
  const newTaskModalRef = useRef<HTMLDialogElement>();

  useEffect(() => {
    if (itemBeingEdited == undefined && itemEditedIdRef.current == "new") {
      setNewHeader(undefined);
      setNewTask(undefined);
    }

    itemEditedIdRef.current = itemBeingEdited?.id;
  }, [itemBeingEdited]);

  const onEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setItemBeingEdited(data);
  };

  const onSave = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.stopPropagation();
    console.log("saving");
    if (name && name !== data?.name) {
      let updatedHeader = { ...data, name: name };
      if (headerType == "company") {
        await updateCompany(updatedHeader);
      } else {
        await updateProject(updatedHeader as Project);
      }
    }
    setItemBeingEdited(undefined);
  };

  const onDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    force = false
  ) => {
    e.stopPropagation();
    if (data && children && children.length > 0 && !force) {
      deleteModalRef.current?.showModal();
    } else {
      if (headerType == "company") {
        await deleteCompany(data as Company);
      } else {
        await deleteProject(data as Project);
      }
    }
  };

  const onAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (data && collapseRef.current) {
      collapseRef.current.checked = true;

      console.log(newTask);
      console.log(newTaskModalRef.current);

      if (headerType == "project") {
        if (!newTask && newTaskModalRef.current) {
          console.log("opening modal");
          newTaskModalRef.current.showModal();
        } else if (newTask) {
          await createTask(newTask);
        }
      } else {
        let newProject: ProjectData = {
          id: "new",
          name: `New ${headerType}`,
          createdAt: new Date(),
          companyId: data?.id,
          groupId: null,
          tasks: [],
        };

        setNewHeader(newProject as T);
        setItemBeingEdited(newProject as T);
      }
    }
  };

  const onCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.stopPropagation();
    setItemBeingEdited(undefined);
  };

  const toggleCollapse = () => {
    if (collapseRef.current) {
      setItemBeingEdited(undefined);
      collapseRef.current.checked = !collapseRef.current.checked;
    }
  };

  return (
    <div className="flex" key={data.id}>
      <dialog className="modal" ref={deleteModalRef as any}>
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Deleting {data?.name}</h3>
          <p className="py-4">
            {`This company has multiple ${
              headerType == "company" ? "projects" : "tasks"
            } that will be deleted along with
            it. Are you sure?`}
          </p>
          <div className="w-full flex justify-end gap-2">
            <button
              className="btn  hover:bg-sky-500 btn-info"
              onClick={(e) => onDelete(e, true)}
            >
              Yes
            </button>
            <button className="btn">No</button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      {headerType == "project" && (
        <NewTaskModal projectId={data.id} modalRef={newTaskModalRef} />
      )}
      <div className="collapse transition-all rounded-none">
        <input type="checkbox" ref={collapseRef as any} />
        <div
          className="pr-14 flex items-center justify-between gap-2 border-b-2 rounded-none collapse-title mx-0 text-xl font-medium hover:bg-slate-100 z-10"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={toggleCollapse}
        >
          <EditableText
            parentDataType="header"
            editing={itemBeingEdited == data}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
            setText={setName}
            text={data.name == "noproj" ? "Misc" : name}
          />
          {hovering && (
            <HeaderActions
              addString={headerType == "company" ? "Project" : "Task"}
              onAdd={(e) => onAdd(e)}
              onDelete={(e) => onDelete(e)}
              onSave={onSave}
              onCancel={(e) => onCancel(e)}
              editing={itemBeingEdited == data}
            />
          )}
        </div>
        <div className="collapse-content !pl-10 !pr-0">
          {newHeader && headerType == "company" && (
            <HeaderList<ProjectData, TaskData>
              data={newHeader as ProjectData}
              headerType="project"
              itemBeingEdited={itemBeingEdited}
              setItemBeingEdited={setItemBeingEdited}
            />
          )}
          {headerType == "company" ? (
            <>
              {children
                ?.sort(
                  (a: TChild, b: TChild) =>
                    b.createdAt.getTime() - a.createdAt.getTime()
                )
                .map((c) => (
                  <HeaderList<ProjectData, TaskData>
                    key={c.id}
                    children={(c as ProjectData).tasks}
                    data={c as ProjectData}
                    headerType="project"
                    itemBeingEdited={itemBeingEdited}
                    setItemBeingEdited={setItemBeingEdited}
                  />
                ))}
            </>
          ) : (
            <>
              {(data as ProjectData).tasks?.map((t) => (
                <TaskItem
                  t={t}
                  key={t.id}
                  itemBeingEdited={itemBeingEdited}
                  setItemBeingEdited={setItemBeingEdited}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
