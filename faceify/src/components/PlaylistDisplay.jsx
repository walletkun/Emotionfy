import React, { useEffect, useState } from "react";
import { Music } from "lucide-react";

export const PlaylistDisplay = ({ emotion }) => {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [iframeFailed, setIframeFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!emotion) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/spotify/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emotion }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch playlist");
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          // Randomly select one playlist from the top 5
          const randomIndex = Math.floor(
            Math.random() * Math.min(data.length, 5)
          );
          setPlaylist(data[randomIndex]);
        } else {
          throw new Error("No playlists found");
        }
      } catch (error) {
        console.error("Failed to fetch playlist:", error);
        setError(error.message);

        // Retry logic for transient failures
        if (retryCount < 2) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [emotion, retryCount]);

  const getPlaylistId = (url) => {
    return url?.split("/").pop() || "";
  };

  const handleIframeLoad = () => {
    setIframeFailed(false);
  };

  const handleIframeError = () => {
    setIframeFailed(true);
  };

  const getPlaceholderBackground = () => {
    // Map emotions to tailwind background colors
    const emotionColors = {
      happy: "bg-yellow-500",
      sad: "bg-blue-500",
      energetic: "bg-red-500",
      calm: "bg-green-500",
      romantic: "bg-pink-500",
      // Add more emotions and colors as needed
      default: "bg-gray-500",
    };

    return emotionColors[emotion?.toLowerCase()] || emotionColors.default;
  };

  if (loading) {
    return (
      <div className="w-full max-w-md p-6 backdrop-blur-xl bg-white/10 rounded-2xl text-white shadow-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md p-6 backdrop-blur-xl bg-white/10 rounded-2xl text-white shadow-lg">
        <p className="text-red-400">
          Failed to load playlist. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-6 backdrop-blur-xl bg-white/10 rounded-2xl text-white shadow-lg">
      <div className="flex items-center gap-6 mb-6">
        {playlist?.image_url ? (
          <img
            src={playlist.image_url}
            alt={`${emotion || "Upload image"} playlist`}
            className="w-16 h-16 rounded-lg object-cover shadow-md"
          />
        ) : (
          <div
            className={`w-16 h-16 rounded-lg shadow-md flex items-center justify-center ${getPlaceholderBackground()}`}
          >
            <Music className="w-8 h-8 text-white" />
          </div>
        )}
        <div>
          <h2 className="font-semibold text-xl">
            {playlist?.name ||
              (emotion ? `${emotion} vibes` : "Upload an image to get started")}
          </h2>
          <p className="text-white/70 text-sm mt-1">Spotify Playlist</p>
        </div>
      </div>

      {playlist && (
        <div className="relative mb-4">
          <div className="relative">
            <iframe
              src={`https://open.spotify.com/embed/playlist/${getPlaylistId(
                playlist.url
              )}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className={`rounded-xl ${iframeFailed ? "hidden" : ""}`}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
            {iframeFailed && (
              <div className="h-[152px] flex items-center justify-center bg-gray-800 rounded-xl">
                <a
                  href={playlist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Open in Spotify
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {playlist && !iframeFailed && (
        <a
          href={playlist.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Open in Spotify
        </a>
      )}
    </div>
  );
};

export default PlaylistDisplay;
