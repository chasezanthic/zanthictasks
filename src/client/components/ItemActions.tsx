import React from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const BTN_IDLE_COLOR = "text-slate-400";

export const ItemActions: React.FC<{
  onDelete: () => void;
  onEdit: () => void;
  editing: boolean;
  onSave: () => void;
  onCancel: () => void;
}> = ({ onDelete, onEdit, onSave, onCancel, editing }) => {
  return (
    <>
      {!editing ? (
        <div className="flex gap-3">
          <button
            className={`z-10 ${BTN_IDLE_COLOR} hover:text-blue-500 transition-all`}
            onClick={onEdit}
          >
            <FaEdit color="inherit" />
          </button>
          <button
            className={`z-10 ${BTN_IDLE_COLOR} hover:text-red-500 transition-all`}
            onClick={onDelete}
          >
            <FaTrash color="inherit" />
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            className={`z-10 ${BTN_IDLE_COLOR} hover:text-blue-500 transition-all`}
            onClick={onSave}
          >
            <FaCheck color="inherit" />
          </button>
          <button
            className={`z-10 ${BTN_IDLE_COLOR} hover:text-red-500 transition-all`}
            onClick={onCancel}
          >
            <FaTimes color="inherit" />
          </button>
        </div>
      )}
    </>
  );
};
