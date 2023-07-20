import React, { useState, useRef, useEffect } from "react";
import { Company, Project, Task } from "@wasp/entities";
import updateCompany from "@wasp/actions/updateCompany";
import createTask from "@wasp/actions/createTask";
import createProject from "@wasp/actions/createProject";
import updateProject from "@wasp/actions/updateProject";
import deleteCompany from "@wasp/actions/deleteCompany";
import deleteProject from "@wasp/actions/deleteProject";
import { HeaderActions } from "./HeaderActions";
import { TaskData, TaskItem } from "../Tasks/TaskItem";
import { EditableText } from "../Shared/EditableText";
import { ItemData, PageAlert } from "../../MainPage";
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
  parentOnSave?: (
    e?: React.MouseEvent<HTMLButtonElement>,
    childName?: string
  ) => void;
  parentOnCancel?: () => void;
  setAlert: (alert: PageAlert) => void;
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
  setAlert,
  itemBeingEdited,
  setItemBeingEdited,
  headerType,
  children,
  parentOnCancel,
  parentOnSave,
}: HeaderListProps<T, TChild>) => {
  const [name, setName] = useState<string | undefined>(data?.name);
  const [hovering, setHovering] = useState(false);
  const [newHeader, setNewHeader] = useState<T | undefined>(undefined);

  const deleteModalRef = useRef<HTMLDialogElement>();
  const collapseRef = useRef<HTMLInputElement>();
  const contentRef = useRef<HTMLDivElement>();
  const newTaskModalRef = useRef<HTMLDialogElement>();

  useEffect(() => {
    if (!itemBeingEdited) {
      setNewHeader(undefined);
    }
  }, [itemBeingEdited]);

  const onEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setItemBeingEdited(data);
  };

  const onSave = async (
    e?: React.MouseEvent<HTMLButtonElement>,
    childName?: string
  ) => {
    if (e) e.stopPropagation();
    if (name && (name !== data?.name || childName)) {
      let updatedHeader = { ...itemBeingEdited, name: childName ?? name };
      if (headerType == "company" && childName) {
        await createProject(updatedHeader as Project);
        setNewHeader(undefined);
      } else if (headerType == "company") {
        await updateCompany(updatedHeader as Company);
      } else if (headerType == "project") {
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

      if (headerType == "project" && newTaskModalRef.current) {
        newTaskModalRef.current.showModal();
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
    setNewHeader(undefined);
  };

  const toggleCollapse = () => {
    if (collapseRef.current) {
      setItemBeingEdited(undefined);
      collapseRef.current.checked = !collapseRef.current.checked;

      if (collapseRef.current.checked && contentRef.current) {
        // determine the position of the element in the viewport
        const rect = contentRef.current.getBoundingClientRect();

        const isOutOfViewport = rect.bottom > window.innerHeight;

        // if the element is not visible in the viewport, scroll to it
        if (isOutOfViewport) {
          contentRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <div className="flex" key={data.id}>
      <dialog className="modal" ref={deleteModalRef as any}>
        <form method="dialog" className="modal-box bg-secondary">
          <h3 className="font-bold text-lg">Deleting {data?.name}</h3>
          <p className="py-4">
            {`This company has multiple ${
              headerType == "company" ? "projects" : "tasks"
            } that will be deleted along with
            it. Are you sure?`}
          </p>
          <div className="w-full flex justify-end gap-2">
            <button
              className="btn hover:bg-accent btn-info"
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
          className="border-r-2 border-l-2 mr-14 flex items-center justify-between gap-2 border-b-[1px] border-t-[1px] rounded-none collapse-title mx-0 text-xl font-medium hover:bg-slate-100 z-10"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={toggleCollapse}
        >
          <EditableText
            parentDataType="header"
            editing={itemBeingEdited == data}
            onEdit={onEdit}
            onSave={parentOnSave ? (e) => parentOnSave(e, name) : onSave}
            onCancel={parentOnCancel ?? onCancel}
            setText={setName}
            text={data.name == "noproj" ? "Misc" : name}
          />
          {hovering && (
            <HeaderActions
              addString={headerType == "company" ? "Project" : "Task"}
              onAdd={(e) => onAdd(e)}
              onDelete={(e) => onDelete(e)}
              onSave={parentOnSave ? (e) => parentOnSave(e, name) : onSave}
              onCancel={parentOnCancel ?? onCancel}
              editing={itemBeingEdited == data}
            />
          )}
        </div>
        <div ref={contentRef as any} className="collapse-content !pl-10 !pr-0">
          {newHeader && headerType == "company" && (
            <HeaderList<ProjectData, TaskData>
              setAlert={setAlert}
              data={newHeader as ProjectData}
              parentOnSave={onSave}
              parentOnCancel={onCancel}
              headerType="project"
              itemBeingEdited={itemBeingEdited}
              setItemBeingEdited={setItemBeingEdited}
            />
          )}
          {headerType == "company" ? (
            <>
              {children?.length && children?.length > 0 ? (
                <>
                  {children
                    ?.sort(
                      (a: TChild, b: TChild) =>
                        b.createdAt.getTime() - a.createdAt.getTime()
                    )
                    .map((c) => (
                      <HeaderList<ProjectData, TaskData>
                        key={c.id}
                        setAlert={setAlert}
                        children={(c as ProjectData).tasks}
                        data={c as ProjectData}
                        headerType="project"
                        itemBeingEdited={itemBeingEdited}
                        setItemBeingEdited={setItemBeingEdited}
                      />
                    ))}
                </>
              ) : (
                <div className="border-2 border-t-[1px] p-5">
                  <span className="text-lg text-neutral opacity-60">
                    No projects for this company yet
                  </span>
                </div>
              )}
            </>
          ) : (data as ProjectData).tasks?.length == 0 ? (
            <div className="border-2 border-t-[1px] p-5">
              <span className="text-lg text-neutral opacity-60">
                No tasks for this project yet
              </span>
            </div>
          ) : (
            <>
              {(data as ProjectData).tasks?.map((t) => (
                <TaskItem
                  t={t}
                  key={t.id}
                  setAlert={setAlert}
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
