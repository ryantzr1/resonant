import React from "react";

const DynamicContentFormatter = ({ content }) => {
  // Check if content is undefined, null, or empty
  if (!content) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <p className="text-gray-500 italic">No content available.</p>
      </div>
    );
  }

  // Split the content into paragraphs
  const paragraphs = content.split(/\n\s*\n/);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        Extracted Content
      </h2>
      {paragraphs.map((paragraph, index) => (
        <div key={index} className="mb-4">
          {paragraph.split(/\n/).map((line, lineIndex) => {
            // Check if the line starts with a number followed by a dot
            if (/^\d+\./.test(line)) {
              return (
                <h3
                  key={lineIndex}
                  className="text-lg font-semibold text-blue-500 mt-4 mb-2"
                >
                  {line}
                </h3>
              );
            }
            // Check if the line starts with asterisks (for potential headers)
            else if (/^\*\*.*\*\*/.test(line)) {
              return (
                <h4
                  key={lineIndex}
                  className="text-md font-semibold text-blue-400 mt-3 mb-1"
                >
                  {line.replace(/\*\*/g, "")}
                </h4>
              );
            }
            // Regular paragraph text
            return (
              <p key={lineIndex} className="text-gray-700 leading-relaxed">
                {line}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default DynamicContentFormatter;
