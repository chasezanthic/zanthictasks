import React, { ChangeEvent, useState } from "react";
import "./Main.css";
import { CompanyItem } from "./components/CompanyItem";
import api from "@wasp/api";

export function FileTest() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    const formData = new FormData();

    if (!file) {
      return;
    }

    formData.append("newFile", file);
    try {
      const response = await api.post("api/file", formData);

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <input type="file" name="newFile" onChange={handleFileSelect} />
      <button onClick={async () => uploadFile()} disabled={!file}>
        Submit
      </button>
    </main>
  );
}
