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
    <div className="container">
      <div className="left-pane">
        <ConverterFormAndResult onSave={handleSaveEntry} setError={setError} />
      </div>
      <div className="right-pane">
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
