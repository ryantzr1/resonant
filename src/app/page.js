/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useRef } from "react";
import DynamicContentFormatter from "./DynamicContentFormatter";
import preFilledContent from "./preFilledContent";

export default function Home() {
  const [content, setContent] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleSpeakingPractice = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSeeExample = () => {
    setContent(preFilledContent);
  };

  return (
    <React.Fragment>
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
                  Upload a PDF file containing language content you wish to
                  learn using the &quot;Upload PDF&quot; button.
                </li>
                <li>
                  After uploading, click "More Examples" to explore in-depth
                  explanations, see additional usage examples, and listen to
                  audio recordings for better comprehension.
                </li>
                <li>
                  Select "Speaking Practice" to actively practice speaking and
                  pronunciation. This will help reinforce what you've learned
                  and provide interactive feedback.
                </li>
                <li>
                  Alternatively, click "See Example" below to view a demo of how
                  the application works.
                </li>
              </ol>
            </div>

            <div className="flex justify-center mb-6 space-x-4">
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

              <button
                onClick={handleSeeExample}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
              >
                See Example
              </button>
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

            {content && (
              <div>
                <p className="mt-4 text-gray-800">
                  <strong>Sample parsed from: </strong>
                  <a
                    href="https://www.learngermanoriginal.com/wp-content/uploads/2018/08/B1-Lesson-5-lassen.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    https://www.learngermanoriginal.com/wp-content/uploads/2018/08/B1-Lesson-5-lassen.pdf
                  </a>
                </p>
                <DynamicContentFormatter content={content} />
              </div>
            )}

            {audioUrl && (
              <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-6">
                <div className="bg-green-50 border-b border-green-100 px-4 py-2">
                  <h2 className="text-xl font-semibold text-green-700 flex items-center">
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
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              disabled={!content || isLoading}
            >
              More Examples
            </button>
            <button
              onClick={handleSpeakingPractice}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              disabled={isLoading}
            >
              Speaking Practice
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div
            className="relative bg-white p-6 rounded-lg shadow-lg z-20 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-center mb-4">
              Speaking Practice with AI Feedback
            </h2>
            <p className="text-gray-700 mb-4">
              Speaking Practice lets you interact with the content you've
              uploaded. After uploading a PDF (such as a textbook or article),
              the AI extracts key language concepts and turns them into
              practical conversation exercises.
            </p>
            <p className="text-gray-700 mb-4">
              For example, you can practice forming sentences using specific
              grammar rules, and the AI will provide corrections and guidance in
              real time, all in a natural, conversational tone.
            </p>
            <p className="text-gray-500 italic mb-4">
              Unfortunately, due to time constraints (we started only 48 hours
              before the deadline), this feature is still in progress. Our goal
              is to let users practice pronunciation and conversation skills
              with real-time AI feedback.
            </p>
            <button
              onClick={closeModal}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mx-auto block transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
