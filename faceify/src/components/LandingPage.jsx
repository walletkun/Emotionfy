import React, { useState, useEffect } from "react";
import AnimatedNotes from "./AnimatedNotes";
import { useTypewriter, useEmotionTypewriter } from "../utils/useTypeWriters";

const LandingPage = () => {
  const emotions = [
    "Happy 😊",
    "Sad 😢",
    "Excited 🤩",
    "Calm 😌",
    "Energetic 💪",
  ];
  const [currentEmotion, setCurrentEmotion] = useState(0);

  const titleText = useTypewriter("Welcome to Emotionfy", 100);
  const baseText = useTypewriter(
    "Discover the perfect playlist that matches your",
    50
  );
  const emotionText = useEmotionTypewriter(emotions[currentEmotion], 50);
  const endText = useTypewriter("mood.", 50);

  useEffect(() => {
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentEmotion((prev) => (prev + 1) % emotions.length);
      }, 2500);

      return () => clearInterval(interval);
    }, 4000);

    return () => clearTimeout(delay);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-blue-600 to-cyan-500 text-white relative overflow-hidden">
      <AnimatedNotes />
      <h1 className="text-6xl font-bold mb-4 animate-pulse">
        {titleText}
        <span className="animate-blink">|</span>
      </h1>
      <p className="text-2xl mb-8 text-center max-w-2xl">
        {baseText}{" "}
        <span className="font-bold text-cyan-300 transition-all duration-300 ease-in-out">
          {emotionText}
        </span>{" "}
        {endText}
      </p>
      <div className="mt-12 text-lg animate-bounce">
        Scroll down to experience the magic
      </div>
    </div>
  );
};

export default LandingPage;
