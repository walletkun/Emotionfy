import React, { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Upload, StopCircle } from "lucide-react";
import Webcam from "react-webcam";

const FaceDetectionVisualizer = ({ imageUrl }) => {
  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt="Detection visualization"
        className="w-full h-auto rounded-lg"
      />
    </div>
  );
};

export const EmotionDetection = ({ onEmotionDetected }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detectionResults, setDetectionResults] = useState(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const intervalRef = useRef(null);

  const startCameraCapture = useCallback(() => {
    setIsCameraActive(true);
    intervalRef.current = setInterval(() => {
      if (webcamRef.current) {
        const screenshot = webcamRef.current.getScreenshot();
        if (screenshot) {
          analyzeCameraFrame(screenshot);
        }
      }
    }, 2000);
  }, []);

  const stopCameraCapture = useCallback(() => {
    setIsCameraActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const analyzeCameraFrame = async (imageSrc) => {
    try {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "camera-frame.jpg");

      const response = await fetch("/api/emotion/analyze", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setDetectionResults(data.results);
      onEmotionDetected(data);
    } catch (err) {
      console.error("Camera frame analysis error:", err);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setDetectionResults(null);
      setImagePreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/emotion/analyze", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();
      setDetectionResults(data.results);
      onEmotionDetected(data);
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
    setDetectionResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => {
            setIsUsingCamera(false);
            stopCameraCapture();
          }}
          className={`px-4 py-2 rounded-md ${
            !isUsingCamera
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          <Upload className="w-5 h-5 inline-block justify-centermr-2" />
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

      <div className="bg-gray-700 rounded-lg p-4 relative">
        {isUsingCamera ? (
          <div className="relative">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-auto"
              mirrored={true}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={
                  isCameraActive ? stopCameraCapture : startCameraCapture
                }
                className={`px-6 py-3 rounded-md ${
                  isCameraActive ? "bg-red-500" : "bg-green-500"
                } text-white font-semibold`}
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
          </div>
        ) : (
          <div className="relative">
            {imagePreview ? (
              <FaceDetectionVisualizer
                imageUrl={imagePreview}
                detections={detectionResults}
              />
            ) : (
              <label
                className="w-full aspect-video flex flex-col items-center justify-center cursor-pointer bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                htmlFor="image-upload"
              >
                <Upload className="w-24 h-24 text-gray-500 mb-4" />
                <span className="text-gray-400 text-lg">
                  Click to upload image
                </span>
              </label>
            )}
            {imagePreview && !loading && !error && (
              <button
                onClick={handleRetry}
                className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-600"
              >
                New Image
              </button>
            )}
          </div>
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
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400" />
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

export default EmotionDetection;
