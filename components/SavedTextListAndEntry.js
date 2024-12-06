import React from "react";

const SavedTextListAndEntry = ({ entries, onDelete, error }) => {
  return (
    <div className="sidebar">
      <h2>Saved Text</h2>
      {entries.length === 0 && <p>No saved entries yet.</p>}
      {entries.map((entry) => (
        <div key={entry.id} className="sidebar-entry">
          <p className="text-spacing">
          
            <strong>ID:</strong> {entry.id}
          </p>
          <p className="text-spacing">
            <strong>Text:</strong> {entry.text}
          </p>
          <p className="text-spacing">
            <strong>Audio URL:</strong>{" "}
            <a 
                href={entry.audioUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="saved-link"
                >
                {entry.audioUrl}
            </a>
          </p>
          <button
            className="buttondelete"
            onClick={() => onDelete(entry.id)}
            
          >
            Delete
          </button>
        </div>
      ))}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SavedTextListAndEntry;
