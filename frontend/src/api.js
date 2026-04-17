import React, { useState } from "react";
import "./App.css";
import {
  uploadImageAndGetCaption,
  uploadImageAndDetectObjects,
} from "./api";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [objects, setObjects] = useState("");
  const [error, setError] = useState("");

  // ✅ Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setCaption("");
      setObjects("");
      setError("");
    }
  };

  // ✅ Generate Caption
  const handleCaption = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    try {
      setError("");
      setCaption("Generating caption...");

      const formData = new FormData();
      formData.append("file", selectedImage);

      const data = await uploadImageAndGetCaption(formData);

      // ✅ SAFE parsing (NO double read)
      setCaption(data.caption || JSON.stringify(data));
    } catch (err) {
      console.error(err);
      setError("Failed to generate caption");
      setCaption("");
    }
  };

  // ✅ Detect Objects
  const handleDetect = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    try {
      setError("");
      setObjects("Detecting objects...");

      const formData = new FormData();
      formData.append("file", selectedImage);

      const data = await uploadImageAndDetectObjects(formData);

      setObjects(JSON.stringify(data));
    } catch (err) {
      console.error(err);
      setError("Failed to detect objects");
      setObjects("");
    }
  };

  return (
    <div className="App">
      <h1>AI Vision Tool</h1>

      <input type="file" onChange={handleImageChange} />

      {preview && (
        <div>
          <img src={preview} alt="preview" width="300" />
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleCaption}>Generate Caption</button>
        <button onClick={handleDetect}>Detect Objects</button>
      </div>

      {caption && (
        <div>
          <h3>Caption:</h3>
          <p>{caption}</p>
        </div>
      )}

      {objects && (
        <div>
          <h3>Detected Objects:</h3>
          <p>{objects}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
