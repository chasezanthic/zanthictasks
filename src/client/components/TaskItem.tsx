import React from "react";
import { Task, TaskAssignment } from "@wasp/entities";

type TaskData = Task & {
  assigned: TaskAssignment[];
};

export const TaskItem: React.FC<{ t: TaskData }> = ({ t }) => {
  return (
    <h4
      className="border-b-gray-400 text-md my-1 hover:bg-slate-300 p-3 rounded-md"
      key={t.id}
    >
      {t.description}
    </h4>
  );
};
