import React, { useState } from "react";
import { Layout } from "./components/Layout";
import { EmotionDetection } from "./components/EmotionDetection";
import { EmotionDisplay } from "./components/EmotionDisplay";
import { PlaylistDisplay } from "./components/PlaylistDisplay";

export default function App() {
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [emotionResults, setEmotionResults] = useState(null);

  const handleEmotionDetected = (results) => {
    setEmotionResults(results);
    if (results.results && results.results[0]) {
      setDetectedEmotion({
        emotion: results.results[0].emotion,
        confidence: results.results[0].confidence,
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="w-full space-y-8">
            <EmotionDetection onEmotionDetected={handleEmotionDetected} />
            {detectedEmotion && (
              <EmotionDisplay
                emotion={detectedEmotion.emotion}
                confidence={detectedEmotion.confidence}
              />
            )}
          </div>
          <div className="w-full h-full flex items-center justify-center lg:sticky lg:top-8">
            <PlaylistDisplay emotion={detectedEmotion?.emotion} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
