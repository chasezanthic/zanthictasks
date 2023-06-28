import React, { useState, useRef, useEffect } from "react";
import { Company, Project, Task, TaskAssignment } from "@wasp/entities";
import { ProjectItem } from "./ProjectItem";
import { ItemActions } from "./ItemActions";

type CompanyData =
  | (Company & {
      projects: (Project & {
        tasks: (Task & {
          assigned: TaskAssignment[];
        })[];
      })[];
    })
  | undefined;

export const CompanyItem: React.FC<{
  c: CompanyData;
  openedCompanies: number[];
  setOpenedCompanies: (state: number[]) => void;
  editingCompany?: number;
  setEditingCompany: (state: number | undefined) => void;
}> = ({
  c,
  openedCompanies,
  setOpenedCompanies,
  editingCompany,
  setEditingCompany,
}) => {
  const [newName, setNewName] = useState(c?.name);

  const inputRef = useRef<HTMLInputElement>();

  const handleOnEdit = () => {
    // headerClicked();
    inputRef.current?.focus();
    console.log("editing");
    setEditingCompany(c?.id);
  };

  const handleInputFocus = () => {
    setTimeout(() => inputRef.current?.select(), 1);
    console.log("focusing");
  };

  const headerClicked = () => {
    setEditingCompany(undefined);
  };

  return (
    <div
      className="collapse p-3 collapse-arrow hover:bg-slate-100 transition-all "
      key={c?.id}
    >
      <input
        type="checkbox"
        className="bg-slate-400"
        style={{ backgroundColor: "red" }}
        onClick={headerClicked}
      />
      <div className="flex justify-between border-b-2 rounded-none mb-2 collapse-title text-xl font-medium">
        {editingCompany !== c?.id ? (
          <span>{c?.name}</span>
        ) : (
          <input
            ref={inputRef as any}
            type="text"
            className="z-10 input text-xl"
            autoFocus={true}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onFocus={handleInputFocus}
          />
        )}
        <ItemActions
          onDelete={() => console.log("deleting company")}
          onEdit={handleOnEdit}
          onSave={() => console.log("avingcompany")}
          onCancel={() => setEditingCompany(undefined)}
          editing={editingCompany == c?.id}
        />
      </div>
      <div className="collapse-content">
        {c?.projects.map((p) => (
          <ProjectItem key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
};
