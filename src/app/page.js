"use client";
import React, { useState, useRef } from "react";
import DynamicContentFormatter from "./DynamicContentFormatter";

export default function Home() {
  const [content, setContent] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError("");
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
      setError("Error uploading file. Please try again.");
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoreExamples = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/generate-examples", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      setContent(data.examples);
      setAudioUrl(data.audioUrl);
    } catch (error) {
      setError("Error generating examples. Please try again.");
      console.error("Error generating examples:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakingPractice = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/speaking-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      setContent(data.prompt);
      setAudioUrl(data.audioUrl);
    } catch (error) {
      setError("Error starting speaking practice. Please try again.");
      console.error("Error starting speaking practice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Resonance: Making Language Textbooks Come to Life
          </h1>

          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-blue-500 mb-3">
              How to Use for Language Learning:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                Upload a PDF file containing language content you wish to learn
                using the &quot;Upload PDF&quot; button.
              </li>
              <li>
                After uploading, click &quot;More Examples&rdquo; to explore
                in-depth explanations, see additional usage examples, and listen
                to audio recordings for better comprehension.
              </li>
              <li>
                Select &quot;Speaking Practice&quot; to actively practice
                speaking and pronunciation. This will help reinforce what
                you&apos;ve learned and provide interactive feedback.
              </li>
            </ol>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload PDF
            </button>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
          </div>

          {isLoading && (
            <div className="text-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Processing...</p>
            </div>
          )}

          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
              role="alert"
            >
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* {content && (
            <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-6">
              <div className="bg-blue-50 border-b border-blue-100 px-4 py-2">
                <h2 className="text-xl font-semibold text-blue-700 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Extracted Content
                </h2>
              </div>
              <div className="p-4">
                <p className="text-gray-700 leading-relaxed">{content}</p>
              </div>
            </div>
          )} */}

          {content && <DynamicContentFormatter content={content} />}

          {audioUrl && (
            <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-6">
              <div className="bg-green-50 border-b border-green-100 px-4 py-2">
                <h2 className="text-xl font-semibold text-green-700 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                  Audio Playback
                </h2>
              </div>
              <div className="p-4">
                <audio src={audioUrl} controls className="w-full" />
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-center space-x-4">
          <button
            onClick={handleMoreExamples}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            disabled={!content || isLoading}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            More Examples
          </button>
          <button
            onClick={handleSpeakingPractice}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            disabled={!content || isLoading}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
            Speaking Practice
          </button>
        </div>
      </div>
    </div>
  );
}
