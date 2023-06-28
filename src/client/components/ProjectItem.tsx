import React from "react";
import { Project, Task, TaskAssignment } from "@wasp/entities";
import { TaskItem } from "./TaskItem";
import { ItemActions } from "./ItemActions";

type ProjectData = Project & {
  tasks: (Task & {
    assigned: TaskAssignment[];
  })[];
};

export const ProjectItem: React.FC<{ p: ProjectData }> = ({ p }) => {
  return (
    <div
      className="collapse collapse-arrow ml-auto w-[95%] hover:bg-slate-200 p-3"
      key={p.id}
    >
      <input type="checkbox" />
      <div className="flex justify-between collapse-title border-b-2 rounded-none my-1 text-lg py-3">
        <h3>{p.title}</h3>
        <ItemActions
          onDelete={() => console.log("deteting project")}
          onEdit={() => console.log("editing project")}
          onSave={() => console.log("saving")}
          onCancel={() => console.log("cancelling")}
          editing
        />
      </div>
      <div className="collapse-content pl-32 px-0">
        {p.tasks.map((t) => (
          <TaskItem key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
};
