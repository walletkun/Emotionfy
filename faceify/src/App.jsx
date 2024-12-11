import React, { useState, useEffect, useRef } from "react";
import { Layout } from "./components/Layout";
import { EmotionDetection } from "./components/EmotionDetection";
import { EmotionDisplay } from "./components/EmotionDisplay";
import { PlaylistDisplay } from "./components/PlaylistDisplay";
import Chatbot from "./components/ChatbotWidget";
import LandingPage from "./components/LandingPage";

export default function App() {
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const [emotionResults, setEmotionResults] = useState(null);
  const [showApp, setShowApp] = useState(false);
  const appRef = useRef(null);

  const handleEmotionDetected = (results) => {
    setEmotionResults(results);
    if (results.results && results.results[0]) {
      setDetectedEmotion({
        emotion: results.results[0].emotion,
        confidence: results.results[0].confidence,
      });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowApp(true);
        } else {
          setShowApp(false);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (appRef.current) {
      observer.observe(appRef.current);
    }

    return () => {
      if (appRef.current) {
        observer.unobserve(appRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="min-h-screen">
        <LandingPage />
      </div>
      <div
        ref={appRef}
        className={`min-h-screen transition-opacity duration-1000 ${
          showApp ? "opacity-100" : "opacity-0"
        }`}
      >
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

          <div className="mt-12">
            <Chatbot detectedEmotion={detectedEmotion} />
          </div>
        </Layout>
      </div>
    </div>
  );
}
