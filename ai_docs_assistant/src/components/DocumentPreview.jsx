// src/components/DocumentPreview.jsx
import React, { useState } from 'react';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaTimes, FaExpand } from 'react-icons/fa';

const DocumentPreview = ({ document, onClose }) => {
  const [fullScreen, setFullScreen] = useState(false);
  
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
      pdf: <FaFilePdf className="text-red-500" />,
      doc: <FaFileWord className="text-blue-500" />,
      docx: <FaFileWord className="text-blue-500" />,
      xls: <FaFileExcel className="text-green-500" />,
      xlsx: <FaFileExcel className="text-green-500" />,
      jpg: <FaFileImage className="text-purple-500" />,
      jpeg: <FaFileImage className="text-purple-500" />,
      png: <FaFileImage className="text-purple-500" />,
    };
    return iconMap[ext] || <FaFilePdf className="text-gray-500" />;
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 ${fullScreen ? '' : 'backdrop-blur-sm'}`}>
      <div className={`${fullScreen ? 'w-full h-full' : 'max-w-4xl w-full max-h-[90vh]'} bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            {getFileIcon(document.name)}
            <div>
              <h3 className="font-semibold">{document.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {document.size} • Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFullScreen(!fullScreen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaExpand />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {/* Document content preview */}
          <div className="prose dark:prose-invert max-w-none">
            <h2>Document Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300">Key Insights</h4>
                <p className="mt-2">{document.summary}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 dark:text-green-300">AI Analysis</h4>
                <ul className="mt-2 space-y-1">
                  <li>✓ Sentiment: Positive</li>
                  <li>✓ Keywords Extracted: 15</li>
                  <li>✓ Entities Identified: 8</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};