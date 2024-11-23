import React, { useState, useRef } from "react";
import { Camera } from "lucide-react";

export const EmotionDetection = ({ onEmotionDetected }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setImagePreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        "http://127.0.0.1:5001/api/emotion/analyze",
        {
          method: "POST",
          body: formData,
          // Remove credentials and simplify headers
          headers: {
            Accept: "application/json",
          },
          mode: "cors", // Add this
        }
      );

      console.log("Response status:", response.status);

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${responseText}`);
      }

      try {
        const data = JSON.parse(responseText);
        console.log("Response data:", data);
        onEmotionDetected(data);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error details:", err);
      setError(err.message || "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setImagePreview(null);
    setError(null);
    fileInputRef.current.value = ""; // Reset file input
  };

  // Rest of your component remains the same
  return (
    <div className="space-y-6">
      <div className="bg-gray-700 rounded-lg p-4 aspect-video relative overflow-hidden">
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            {!loading && !error && (
              <button
                onClick={handleRetry}
                className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-600"
              >
                New Image
              </button>
            )}
          </div>
        ) : (
          <label
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
            htmlFor="image-upload"
          >
            <Camera className="w-16 h-16 text-gray-500 mb-2" />
            <span className="text-gray-400">Click to upload image</span>
          </label>
        )}
        <input
          id="image-upload"
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>

      {loading && (
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            <p className="text-blue-400">Analyzing image...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-red-400 mb-2">Error: {error}</p>
          <button
            onClick={handleRetry}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
