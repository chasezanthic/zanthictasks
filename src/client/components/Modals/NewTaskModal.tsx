import React, { useState, useRef } from "react";
import { Listbox } from "@headlessui/react";
import { Task } from "@wasp/entities";
import { TaskData } from "../Tasks/TaskItem";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";
import getUserIds from "@wasp/queries/getUserIds";
import createTask from "@wasp/actions/createTask";
import updateAssignees from "@wasp/actions/updateAssignees";
import { useQuery } from "@wasp/queries";

export const NewTaskModal = ({
  projectId,
  modalRef,
}: {
  projectId: string;
  modalRef: React.MutableRefObject<HTMLDialogElement | undefined>;
}) => {
  const initTask: TaskData = {
    id: "new",
    description: "",
    comments: "",
    status: 0,
    createdAt: new Date(),
    projectId: projectId,
    assigned: [],
  };

  const [newTask, setNewTask] = useState<TaskData>(initTask);
  const { data: users } = useQuery(getUserIds);
  const [assignees, setAssignees] = useState<
    { username: string; id: string }[]
  >([]);

  const saveTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (newTask.description) {
      const _newTask = await createTask(newTask);
      if (assignees.length > 0) {
        await updateAssignees({
          taskId: _newTask.id,
          deletedAssigneeIds: [],
          addedAssigneeIds: assignees.map((a) => a.id),
        });
      }
    }
  };

  return (
    <dialog className="modal" ref={modalRef as any}>
      <form
        method="dialog"
        className="modal-box bg-secondary flex flex-col gap-5"
      >
        <h3 className="font-bold text-lg p-1 pt-0">Adding new task</h3>
        <div className="flex flex-col gap-1">
          <input
            value={newTask.description}
            onChange={(e) => {
              setNewTask({ ...newTask, description: e.target.value });
            }}
            className="textarea-bordered textarea w-full"
            placeholder="Description"
          />
        </div>
        <textarea
          value={newTask.comments ?? ""}
          onChange={(e) => setNewTask({ ...newTask, comments: e.target.value })}
          className="textarea-bordered textarea w-full"
          placeholder="Comments"
        />
        <div className="flex flex-col">
          <span className="mb-2">Assignees</span>
          <div className="flex flex-col border-[1px] border-gray-300">
            <Listbox value={assignees} onChange={setAssignees} multiple>
              <Listbox.Button className="px-1 py-2 border-b-[1px] mx-1">
                {assignees.length < 1
                  ? "No assignees"
                  : assignees.map((a) => a.username).join(", ")}
              </Listbox.Button>
              <Listbox.Options className="p-1" static>
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
          </div>
        </div>
        <div className="w-full text-neutral flex justify-end gap-2">
          <button
            disabled={!newTask.description}
            className="btn text-neutral btn-info disabled:text-neutral disabled:opacity-50"
            onClick={saveTask}
          >
            Save
          </button>
          <button className="btn">Cancel</button>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
