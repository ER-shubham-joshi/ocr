import "./App.css";
import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import { langOptions } from "./constant/App.constant";

function App() {
  const [file, setFile] = useState("");
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("eng");
  const [disableSubmit, setDisableSubmit] = useState(true);

  useEffect(() => {
    if (progress > 0 && progress < 1) setDisableSubmit(true);
    else setDisableSubmit(false);
  }, [progress]);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const processImage = () => {
    setDisableSubmit(true);
    setProgress(0);
    Tesseract.recognize(file, language, {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(m.progress);
        }
        if (m.progress > 0 && m.progress < 1) {
          setDisableSubmit(true);
        }
        if (progress === 1) {
          setDisableSubmit(false);
        }
      },
    }).then(({ data: { text } }) => {
      setText(text);
    });
  };
  return (
    <div className="App">
      <div>
        <h1>Extract Text From Image</h1>
      </div>
      <div id="file">
        <input type="file" onChange={onFileChange} />
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {langOptions.map(({ key, value }) => (
            <option value={value}>{key}</option>
          ))}
        </select>
      </div>

      <div id="submit">
        <input
          type="button"
          value="Submit"
          disabled={disableSubmit}
          onClick={processImage}
        />
      </div>

      <div id="progress">
        <progress value={progress} max={1} />
        <span style={{ marginLeft: "5px" }}>{Math.floor(progress * 100)}%</span>
      </div>

      <div id="textArea">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="25"
          cols="100"
        />
      </div>
    </div>
  );
}

export default App;
