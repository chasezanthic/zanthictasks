import React from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaPlus } from "react-icons/fa";

const BTN_IDLE_COLOR = "text-slate-400";

export const HeaderActions: React.FC<{
  addString: string;
  onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onAdd: (e: React.MouseEvent<HTMLButtonElement>) => void;
  editing: boolean;
  onSave: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ onAdd, onDelete, editing, addString }) => {
  return (
    <div className="flex-1 items-center">
      {!editing && (
        <div className="flex w-full items-center justify-between gap-5">
          <button
            className={`z-10 ${BTN_IDLE_COLOR} hover:text-green-500 transition-all flex justify-center items-center rounded-full gap-2`}
            onClick={(e) => onAdd(e)}
          >
            <FaPlus />
            {` New ${addString}`}
          </button>
          <button
            className={`z-10 ${BTN_IDLE_COLOR} hover:text-red-500 transition-all flex justify-center items-center rounded-full gap-2`}
            onClick={(e) => onDelete(e)}
          >
            <FaTrash color="inherit" />
          </button>
        </div>
      )}
    </div>
  );
};
