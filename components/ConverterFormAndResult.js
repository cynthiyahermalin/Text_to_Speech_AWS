import React, { useState } from "react";
import axios from "axios";
import image from '../image/tts.png';
import {API_URL} from '../utils.js';

const ConverterFormAndResult = ({ onSave, setError }) => {
  const [id, setId] = useState("");
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const handleConvert = async () => {
    setError("");
    try {
      const response = await axios.post(`${API_URL}/convert`, { id, text });
      setAudioUrl(response.data.audioUrl);
      onSave({ id, text, audioUrl: response.data.audioUrl });
      
    } catch (err) {
      console.error("Error converting text:", err.message);
      setError("Failed to convert text to speech.");
    }
  };

  return (
    <div>
      <div className="heading-with-logo">
        <img src={image} alt="" />
        <h1>Text-to-Speech Converter</h1>
      </div>
      <div className="component-container">
        <input
          className="text-input"
          type="text"
          placeholder="Enter unique ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <textarea
          className="textarea"
          rows="5"
          placeholder="Enter text here"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
      <button className="buttonconvert" onClick={handleConvert}>
        Convert to Speech
      </button>
      {audioUrl && (
        <div className="audio-container">
          <h3>Generated Audio:</h3>
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
        </div>
      )}
    </div>
  );
};

export default ConverterFormAndResult;
