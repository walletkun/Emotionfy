import React from 'react';

export const EmotionDisplay = ({ emotion, confidence }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h2 className="text-2xl font-semibold mb-2">Detected Emotion</h2>
      {emotion ? (
        <p className="text-4xl font-bold text-blue-400 capitalize">
          {emotion} {confidence && `(${(confidence * 100).toFixed(1)}%)`}
        </p>
      ) : (
        <p className="text-4xl font-bold text-gray-500">Upload an image</p>
      )}
    </div>
  );
};