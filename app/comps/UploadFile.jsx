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
      <label
        htmlFor="file-upload"
        className="cursor-pointer inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
      >
        Choose CSV file
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!file}
      >
        {file ? "Upload" : "Select a file"}
      </button>
    </form>
  );
}
