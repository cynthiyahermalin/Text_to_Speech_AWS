import React, { useState } from "react";
import ConverterFormAndResult from "./components/ConverterFormAndResult";
import SavedTextListAndEntry from "./components/SavedTextListAndEntry";
import "./App.css";


const App = () => {
  const [savedEntries, setSavedEntries] = useState([]);
  const [error, setError] = useState("");

  const handleSaveEntry = (entry) => {
    setSavedEntries((prev) => [...prev, entry]);
  };

  const handleDeleteEntry = (id) => {
    setSavedEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <div style={{ display: "flex", marginTop: "50px" }}>
      <div style={{ flex: 2, padding: "20px" }}>
        <ConverterFormAndResult onSave={handleSaveEntry} setError={setError} />
      </div>
      <div style={{ flex: 1, padding: "20px", borderLeft: "1px solid #ccc" }}>
        <SavedTextListAndEntry
          entries={savedEntries}
          onDelete={handleDeleteEntry}
          error={error}
        />
      </div>
    </div>
  );
};

export default App;
