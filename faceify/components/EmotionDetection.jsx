import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';

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
      formData.append('image', file);

      const response = await fetch('http://localhost:5000/api/emotion/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      onEmotionDetected(data);
    } catch (err) {
      setError(err.message);
      console.error('Error: ', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-700 rounded-lg p-4 aspect-video relative overflow-hidden">
        {imagePreview ? (
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-full object-contain"
          />
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
          <p className="text-blue-400">Analyzing image...</p>
        </div>
      )}

      {error && (
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-red-400">Error: {error}</p>
        </div>
      )}
    </div>
  );
};