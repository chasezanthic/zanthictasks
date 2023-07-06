import React, { useState, useRef, useEffect } from "react";
import { Task, TaskAssignment } from "@wasp/entities";
import { FaTrash, FaCheck, FaPlus } from "react-icons/fa";
import { MdArchive, MdUnarchive } from "react-icons/md";
import { TbZzz, TbZzzOff } from "react-icons/tb";
import { EditableText } from "../Shared/EditableText";
import { ItemData } from "../../MainPage";
import updateTask from "@wasp/actions/updateTask";
import deleteTask from "@wasp/actions/deleteTask";
import updateAssignees from "@wasp/actions/updateAssignees";
import { useQuery } from "@wasp/queries";
import getUserIds from "@wasp/queries/getUserIds";
import { Listbox } from "@headlessui/react";
export type TaskData = Task & {
  assigned: (TaskAssignment & {
    user: {
      username: string;
    };
  })[];
};

export const TaskItem: React.FC<{
  t: TaskData;
  itemBeingEdited: ItemData;
  setItemBeingEdited: (item: ItemData) => void;
}> = ({ t, itemBeingEdited, setItemBeingEdited }) => {
  const [hovering, setHovering] = useState(false);
  const [description, setDescription] = useState(t.description);
  const [assignees, setAssignees] = useState(
    t.assigned.map((a) => ({ username: a.user.username, id: a.userId }))
  );
  const [fieldBeingEdited, setFieldBeingEdited] = useState<
    "desc" | "comments" | undefined
  >();
  const [comments, setComments] = useState<string | undefined>(
    t.comments ? t.comments : undefined
  );

  const { data: users } = useQuery(getUserIds);

  const {
    data: userIds,
    isFetching: isFetchingUserIds,
    error: userIdsError,
  } = useQuery(getUserIds);

  const deleteModalRef = useRef<HTMLDialogElement>();
  const assigneeModalRef = useRef<HTMLDialogElement>();

  const toggleArchive = () => {
    updateStatus(t.status == 3 ? 2 : 3);
  };

  const toggleInactive = () => {
    updateStatus(t.status == 0 ? 1 : 0);
  };

  const onCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.stopPropagation();
    setItemBeingEdited(undefined);
  };

  const onDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    force = false
  ) => {
    e.stopPropagation();
    if (t && !force) {
      deleteModalRef.current?.showModal();
    } else {
      deleteTask(t);
    }
  };

  const updateStatus = (status: number) => {
    updateTask({ ...t, status });
  };

  const onEditDesc = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setItemBeingEdited(t);
    setFieldBeingEdited("desc");
  };

  const onEditComments = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setItemBeingEdited(t);
    setFieldBeingEdited("comments");
  };

  const onSaveDesc = async () => {
    if (description && description !== t?.description) {
      let updatedTask: Task = { ...t, description };
      await updateTask(updatedTask);
    }
  };

  const onSaveComments = async () => {
    if (comments && comments !== t.comments) {
      let updatedTask: Task = { ...t, comments };
      await updateTask(updatedTask);
    }
  };

  const onSaveAssignees = async () => {
    if (assignees) {
      const deletedAssignees = t.assigned
        .filter((a) => !assignees.map((a) => a.id).includes(a.userId))
        .map((a) => a.userId);
      const addedAssignees = assignees
        .filter((a) => !t.assigned.map((a) => a.userId).includes(a.id))
        .map((a) => a.id);

      console.log(deletedAssignees);
      console.log(addedAssignees);

      await updateAssignees({
        taskId: t.id,
        deletedAssigneeIds: deletedAssignees,
        addedAssigneeIds: addedAssignees,
      });
    }
  };

  const statusButton = (status: number) => {
    const classes =
      "transition-all ease-in-out text-slate-400 hover:text-black";

    switch (status) {
      case 0:
        return (
          <button onClick={toggleInactive} className={classes}>
            <TbZzz size={25} />
          </button>
        );
      case 1:
        return (
          <button onClick={toggleInactive} className={classes}>
            <TbZzzOff size={25} />
          </button>
        );
      case 2:
        return (
          <button onClick={toggleArchive} className={classes}>
            <MdArchive size={25} />
          </button>
        );
      case 3:
        return (
          <button onClick={toggleArchive} className={classes}>
            <MdUnarchive size={25} />
          </button>
        );
    }
  };

  const showAssigneeModal = () => {
    if (assigneeModalRef.current) {
      assigneeModalRef.current.showModal();
    }
  };

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="flex items-center gap-10 justify-between border-b-gray-400 text-md my-1 hover:bg-slate-100 p-3"
    >
      <dialog className="modal" ref={deleteModalRef as any}>
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Deleting Task</h3>
          <p className="py-4">{`Are you sure you want to delete this task?`}</p>
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
      <dialog className="modal" ref={assigneeModalRef as any}>
        <form method="dialog" className="modal-box">
          <Listbox value={assignees} onChange={setAssignees} multiple>
            <Listbox.Button className="border-gray-400 w-full input mb-5">
              {assignees.length < 1
                ? "No assignees"
                : assignees.map((a) => a.username).join(", ")}
            </Listbox.Button>
            <Listbox.Options static>
              <>
                {assignees.map((a) => (
                  <Listbox.Option
                    key={a.id}
                    value={a}
                    className="hover:bg-gray-200 p-2 cursor-pointer flex gap-3 items-center hover:opacity-50"
                  >
                    {a.username}
                    {assignees.includes(a) && <FaCheck />}
                  </Listbox.Option>
                ))}
                {users
                  ?.filter((u) => !assignees.map((a) => a.id).includes(u.id))
                  .map((u) => (
                    <Listbox.Option
                      key={u.id}
                      value={u}
                      className="hover:bg-gray-200 p-2 cursor-pointer flex gap-3 items-center"
                    >
                      {u.username}
                    </Listbox.Option>
                  ))}
              </>
            </Listbox.Options>
          </Listbox>
          <div className="flex gap-2">
            <button
              onClick={onSaveAssignees}
              className="btn btn-successw flex-1 mt-5"
            >
              Save
            </button>
            <button className="btn flex-1 mt-5">Cancel</button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div
        style={{ width: t.status == 1 || t.status == 3 ? "100%" : 0 }}
        className="transition-all duration-500 absolute right-[10%] h-[2px] bg-slate-400 z-20"
      ></div>
      <div className="flex gap-3 w-[30%] items-center h-full">
        <input
          value={t.status == 2 || t.status == 3 ? "checked" : ""}
          onChange={() => updateStatus(t.status == 2 || t.status == 3 ? 0 : 2)}
          checked={t.status == 2 || t.status == 3 ? true : false}
          type="checkbox"
          className={`checkbox checkbox-accent`}
          style={{
            cursor: t.status == 1 || t.status == 3 ? "default" : "pointer",
          }}
          disabled={t.status == 1 || t.status == 3}
        />
        {t.status == 1 || t.status == 3 ? (
          <span className="p-2 text-slate-400">{description}</span>
        ) : (
          <EditableText
            parentDataType="task"
            editing={itemBeingEdited == t && fieldBeingEdited == "desc"}
            text={description}
            setText={setDescription}
            onEdit={onEditDesc}
            onSave={onSaveDesc}
            onCancel={onCancel}
          />
        )}
      </div>
      {t.status == 1 || t.status == 3 ? (
        <span className="w-[50%] p-2 text-slate-400">
          {comments ?? "No comments"}
        </span>
      ) : (
        <EditableText
          className="w-[50%]"
          parentDataType="task"
          editing={itemBeingEdited == t && fieldBeingEdited == "comments"}
          text={comments ?? "No comments"}
          setText={setComments}
          onEdit={onEditComments}
          onSave={onSaveComments}
          onCancel={onCancel}
        />
      )}
      <button
        className="flex gap-3 hover:bg-slate-300 p-1 rounded-md"
        onClick={showAssigneeModal}
      >
        {t.assigned.length > 0 ? (
          <>
            {t.assigned.map((a) => (
              <div className="avatar placeholder" key={a.userId}>
                <div
                  style={{
                    backgroundColor:
                      t.status == 1 || t.status == 3 ? "slategray" : "black",
                    opacity: t.status == 1 || t.status == 3 ? 0.5 : 1,
                  }}
                  className="text-neutral-content rounded-full w-8"
                >
                  <span>{a.user.username.at(0)}</span>
                </div>
              </div>
            ))}
          </>
        ) : !(t.status == 1 || t.status == 3) ? (
          <button
            className={`flex gap-2 items-center`}
            style={{
              color: t.status == 1 || t.status == 3 ? "slategray" : "black",
            }}
          >
            <FaPlus />
            Assignee
          </button>
        ) : null}
      </button>
      <div className="flex gap-5 w-[10%] justify-end">
        {hovering && (
          <div className="flex gap-5">
            {statusButton(t.status)}
            <button
              onClick={onDelete}
              className="text-slate-400 hover:text-red-500"
            >
              <FaTrash size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
