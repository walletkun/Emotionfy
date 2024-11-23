import React, { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Upload, StopCircle } from "lucide-react";
import Webcam from "react-webcam";

export const EmotionDetection = ({ onEmotionDetected }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const intervalRef = useRef(null);

  const startCameraCapture = useCallback(() => {
    console.log("Starting camera capture");
    setIsCameraActive(true);
    // Capture frame every 2 seconds
    intervalRef.current = setInterval(() => {
      if (webcamRef.current) {
        const screenshot = webcamRef.current.getScreenshot();
        if (screenshot) {
          console.log("Captured frame, analyzing...");
          analyzeCameraFrame(screenshot);
        }
      }
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const stopCameraCapture = useCallback(() => {
    setIsCameraActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  //Convert the image to base64 to blob
  const analyzeCameraFrame = async (imageSrc) => {
    try {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "camera-frame.jpg");

      const response = await fetch(
        "http://127.0.0.1:5001/api/emotion/analyze",
        {
          method: "POST",
          body: formData,
          mode: "cors",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Emotion detection result:", data);
      onEmotionDetected(data);
    } catch (err) {
      console.error("Camera frame analysis error:", err);
      setError(err.message);
    }
  };

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
          headers: {
            Accept: "application/json",
          },
          mode: "cors",
        }
      );

      if (response.status === 404) {
        console.log("No faces detected in frame");
        // Don't set error, just continue capturing
        return;
      }

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
    fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setIsUsingCamera(false)}
          className={`px-4 py-2 rounded-md ${
            !isUsingCamera
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          <Upload className="w-5 h-5 inline-block mr-2" />
          Upload
        </button>
        <button
          onClick={() => setIsUsingCamera(true)}
          className={`px-4 py-2 rounded-md ${
            isUsingCamera
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          <Camera className="w-5 h-5 inline-block mr-2" />
          Camera
        </button>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 aspect-video relative overflow-hidden">
        {isUsingCamera ? (
          <div className="relative h-full">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-contain"
              mirrored={true}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <button
                onClick={
                  isCameraActive ? stopCameraCapture : startCameraCapture
                }
                className={`px-6 py-3 rounded-md ${
                  isCameraActive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white font-semibold shadow-lg transition-colors duration-200`}
              >
                {isCameraActive ? (
                  <>
                    <StopCircle className="w-6 h-6 inline-block mr-2" />
                    Stop Camera
                  </>
                ) : (
                  <>
                    <Camera className="w-6 h-6 inline-block mr-2" />
                    Start Camera
                  </>
                )}
              </button>
            </div>
            {/* Add an overlay to show camera status */}
            {isCameraActive && (
              <div className="absolute top-4 right-4 bg-green-500 px-3 py-1 rounded-full text-white text-sm">
                Camera Active
              </div>
            )}
          </div>
        ) : imagePreview ? (
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
            <Upload className="w-16 h-16 text-gray-500 mb-2" />
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
