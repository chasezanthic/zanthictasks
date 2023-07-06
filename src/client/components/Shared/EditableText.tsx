import React, { useState, useRef } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";

const BTN_IDLE_COLOR = "text-slate-400";

export const EditableText = ({
  className,
  parentDataType,
  editing,
  text,
  setText,
  onEdit,
  onSave,
  onCancel,
}: {
  parentDataType: "header" | "task";
  className?: string;
  editing: boolean;
  text?: string;
  setText: (text: string) => void;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSave: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel: () => void;
}) => {
  const [hovering, setHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>();

  const handleInputFocus = () => {
    setTimeout(() => inputRef.current?.select(), 1);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key == "Enter") {
      onSave();
    }
    if (e.key == "Escape") {
      onCancel();
    }
  };

  const getTextInputProps = (type: "textarea" | "input") => ({
    ref: inputRef as any,
    className: `z-10  w-[75%] ${type}`,
    autoFocus: true,
    value: text,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setText(e.target.value),
    onFocus: handleInputFocus,
    onKeyDown: handleKeyPress,
  });

  const onEditPressed = (e: React.MouseEvent<HTMLButtonElement>) => {
    setHovering(false);
    onEdit(e);
  };

  return (
    <div className={`z-10 ${className}`}>
      {!editing ? (
        <button
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={onEditPressed}
          className="hover:border-solid hover:text-blue-500 rounded-md p-2 flex gap-2 text-start items-center"
        >
          <p className="break-words">{text}</p>
          <FaEdit
            style={{ minWidth: 20, minHeight: 20, display: "block" }}
            visibility={hovering ? "visible" : "hidden"}
          />
        </button>
      ) : (
        <div className="flex gap-5 w-full">
          {parentDataType == "header" ? (
            <input
              {...getTextInputProps("input")}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <textarea {...getTextInputProps("textarea")} />
          )}
          <button
            className={`z-10 ${BTN_IDLE_COLOR} hover:text-green-500 transition-all flex justify-center items-center rounded-full gap-2`}
            onClick={onSave}
          >
            <FaCheck color="inherit" />
          </button>
          <button
            className={`z-10 ${BTN_IDLE_COLOR} hover:text-red-500 transition-all flex justify-center items-center rounded-full gap-2`}
            onClick={onCancel}
          >
            <FaTimes color="inherit" />
          </button>
        </div>
      )}
    </div>
  );
};
