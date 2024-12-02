const getEmotionEmoji = (emotion) => {
  const emojiMap = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    fear: "😨",
    disgust: "🤢",
    surprise: "😮",
    neutral: "😐",
  };
  return emojiMap[emotion?.toLowerCase()] || "";
};

export const EmotionDisplay = ({ emotion }) => {
  if (!emotion) return null;

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h2 className="text-2xl font-semibold mb-2">Detected Emotion</h2>
      <div className="text-4xl flex items-center gap-3">
        <span className="text-blue-400 capitalize">{emotion}</span>
        <span>{getEmotionEmoji(emotion)}</span>
      </div>
    </div>
  );
};
