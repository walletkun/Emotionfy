import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { EmotionDetection } from './components/EmotionDetection';
import { EmotionDisplay } from './components/EmotionDisplay';
import { PlaylistDisplay } from './components/PlaylistDisplay';

export default function App() {
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [emotionResults, setEmotionResults] = useState(null);

  const handleEmotionDetected = (results) => {
    setEmotionResults(results);
    if (results.results && results.results[0]) {
      setDetectedEmotion({
        emotion: results.results[0].emotion,
        confidence: results.results[0].confidence
      });
    }
  };

  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <EmotionDetection onEmotionDetected={handleEmotionDetected} />
          <EmotionDisplay 
            emotion={detectedEmotion?.emotion}
            confidence={detectedEmotion?.confidence}
          />
        </div>
        <PlaylistDisplay emotion={detectedEmotion?.emotion} />
      </div>
    </Layout>
  );
}