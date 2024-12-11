// useTypeWriters.js
import { useState, useEffect } from "react";

export const useTypewriter = (text, speed = 50) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let isMounted = true;
    setDisplayedText("");

    const timeoutId = setTimeout(() => {
      for (let i = 0; i <= text.length; i++) {
        setTimeout(() => {
          if (isMounted) {
            setDisplayedText(text.slice(0, i));
          }
        }, speed * i);
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [text, speed]);

  return displayedText;
};

export const useEmotionTypewriter = (text, speed = 50) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let isMounted = true;
    setDisplayedText("");

    const typeText = () => {
      for (let i = 0; i <= text.length; i++) {
        setTimeout(() => {
          if (isMounted) {
            setDisplayedText(text.slice(0, i));
          }
        }, speed * i);
      }
    };

    typeText();

    return () => {
      isMounted = false;
    };
  }, [text, speed]);

  return displayedText;
};
