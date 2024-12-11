import React from "react";

const AnimatedNotes = () => {
  const notes = [
    { left: "10%", delay: "0s", emoji: "🎵" },
    { left: "20%", delay: "0.5s", emoji: "🎶" },
    { left: "30%", delay: "1s", emoji: "🎸" },
    { left: "40%", delay: "1.5s", emoji: "🥁" },
    { left: "50%", delay: "2s", emoji: "🎹" },
    { left: "60%", delay: "2.5s", emoji: "🎺" },
    { left: "70%", delay: "3s", emoji: "🎷" },
    { left: "80%", delay: "3.5s", emoji: "🎻" },
    { left: "90%", delay: "4s", emoji: "🎤" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {notes.map((note, index) => (
        <div
          key={index}
          className="absolute text-4xl animate-float opacity-50"
          style={{
            left: note.left,
            animationDelay: note.delay,
          }}
        >
          {note.emoji}
        </div>
      ))}
    </div>
  );
};

export default AnimatedNotes;
