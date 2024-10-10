"use client";
import React, { useState, useRef } from "react";
import axios from "axios";

export default function Home() {
  const [content, setContent] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { extractedContent } = await response.json();
      setContent(extractedContent);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleMoreExamples = async () => {
    try {
      const response = await axios.post("/api/generate-examples", { content });
      setContent(response.data.examples);
      setAudioUrl(response.data.audioUrl);
    } catch (error) {
      console.error("Error generating examples:", error);
    }
  };

  const handleSpeakingPractice = async () => {
    try {
      const response = await axios.post("/api/speaking-practice", { content });
      setContent(response.data.prompt);
      setAudioUrl(response.data.audioUrl);
    } catch (error) {
      console.error("Error starting speaking practice:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Language Learning MVP</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="mb-4"
      />
      <div className="mb-4">
        <button
          onClick={handleMoreExamples}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          More Examples
        </button>
        <button
          onClick={handleSpeakingPractice}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Speaking Practice
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Content:</h2>
        <p>{content}</p>
      </div>
      {audioUrl && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Audio:</h2>
          <audio src={audioUrl} controls />
        </div>
      )}
    </div>
  );
}
