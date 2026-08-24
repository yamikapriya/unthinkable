import { useState } from "react";
import "./App.css";
import { extractTextFromPDF } from "./utils/pdfExtractor";
import { extractTextFromImage } from "./utils/ocrExtractor";

function analyzeContent(text) {
  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);

  let score = 50;
  const strengths = [];
  const suggestions = [];

  if (words.length >= 30 && words.length <= 300) {
    score += 10;
    strengths.push("Good content length.");
  } else if (words.length < 30) {
    suggestions.push("Add more useful information to the post.");
  } else {
    suggestions.push("Consider making the post shorter and easier to read.");
  }

  if (text.includes("?")) {
    score += 10;
    strengths.push("Uses a question to encourage interaction.");
  } else {
    suggestions.push("Add a question to encourage comments.");
  }

  const ctaWords = [
    "comment",
    "share",
    "follow",
    "subscribe",
    "click",
    "join",
    "visit",
    "download",
    "learn more"
  ];

  if (ctaWords.some((word) => lower.includes(word))) {
    score += 10;
    strengths.push("Contains a call-to-action.");
  } else {
    suggestions.push("Add a clear call-to-action.");
  }

  const hashtags = text.match(/#[a-zA-Z0-9_]+/g);

  if (hashtags) {
    score += 10;
    strengths.push(`Uses ${hashtags.length} hashtag(s).`);
  } else {
    suggestions.push("Add relevant hashtags.");
  }

  const attentionWords = [
    "new",
    "best",
    "tips",
    "discover",
    "learn",
    "amazing",
    "important",
    "how",
    "why"
  ];

  if (attentionWords.some((word) => lower.includes(word))) {
    score += 10;
    strengths.push("Uses attention-grabbing words.");
  } else {
    suggestions.push("Use stronger attention-grabbing words.");
  }

  return {
    score: Math.min(score, 100),
    wordCount: words.length,
    strengths,
    suggestions
  };
}

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selected = event.target.files[0];

    if (!selected) return;

    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg"
    ];

    if (!allowed.includes(selected.type)) {
      setError("Please upload a PDF, PNG, or JPG file.");
      return;
    }

    setFile(selected);
    setText("");
    setAnalysis(null);
    setError("");
    setProgress(0);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");
    setText("");
    setAnalysis(null);
    setProgress(0);

    try {
      let extractedText;

      if (file.type === "application/pdf") {
        extractedText = await extractTextFromPDF(file);
      } else {
        extractedText = await extractTextFromImage(
          file,
          (value) => setProgress(value)
        );
      }

      if (!extractedText) {
        setError("No text could be extracted.");
        return;
      }

      setText(extractedText);

      const result = analyzeContent(extractedText);
      setAnalysis(result);

    } catch (err) {
      console.error(err);
      setError("Something went wrong while processing the file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">

        <h1>Social Media Content Analyzer</h1>

        <p className="subtitle">
          Upload your social media content and get engagement improvement
          suggestions.
        </p>

        <div className="upload-box">

          <div className="upload-icon">📄</div>

          <h2>Upload Your Content</h2>

          <p>Upload a PDF or image file</p>

          <label className="upload-button">
            Choose File

            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              hidden
            />
          </label>

          <p className="file-types">
            Supported formats: PDF, PNG, JPG, JPEG
          </p>

        </div>

        {file && (
          <div className="file-card">

            <h3>Selected File</h3>

            <p>
              <strong>Name:</strong> {file.name}
            </p>

            <p>
              <strong>Size:</strong>{" "}
              {(file.size / 1024).toFixed(2)} KB
            </p>

            <button
              className="analyze-button"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Content"}
            </button>

            {loading && file.type !== "application/pdf" && (
              <p className="progress">
                OCR Progress: {progress}%
              </p>
            )}

          </div>
        )}

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {text && (
          <div className="results">

            <h2>Extracted Text</h2>

            <div className="text-result">
              <pre>{text}</pre>
            </div>

          </div>
        )}

        {analysis && (
          <div className="analysis-card">

            <h2>Content Analysis</h2>

            <div className="score">
              <span>Engagement Score</span>

              <strong>
                {analysis.score}/100
              </strong>
            </div>

            <p className="word-count">
              <strong>Word Count:</strong>{" "}
              {analysis.wordCount}
            </p>

            <div className="analysis-section">

              <h3>✓ Strengths</h3>

              <ul>
                {analysis.strengths.map((item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                ))}
              </ul>

            </div>

            <div className="analysis-section">

              <h3>⚠ Suggestions</h3>

              <ul>
                {analysis.suggestions.map((item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                ))}
              </ul>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;
