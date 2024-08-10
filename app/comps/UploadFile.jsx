"use client";

import { useState } from "react";
import Papa from "papaparse";

export default function UploadFile({ onFileUpload }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const csvData = event.target.result;
      const parsedData = Papa.parse(csvData, { header: true });

      onFileUpload(parsedData.data);
    };

    reader.readAsText(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
}
