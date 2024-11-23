import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Music, Loader } from "lucide-react";

export const PlaylistDisplay = ({ emotion }) => {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!emotion) return;

    const fetchPlaylist = async () => {
      setLoading(true);
      setError(null);

      try {
        const dominantEmotion = emotion.results?.[0]?.emotion || "neutral";
        console.log("Fetching playlist for emotion:", dominantEmotion);

        const response = await fetch(
          "/api/spotify/recommendations",
          {

            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              emotion: dominantEmotion,
            }),
          }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(
            `Failed to fetch playlist. Status: ${response.status}`
          );
        }

        const playlists = await response.json();
        console.log("Received playlists:", playlists);

        if (playlists.length > 0) {
          setPlaylist(playlists[0]);
        } else {
          setPlaylist(null);
        }
      } catch (err) {
        console.error("Error fetching playlist:", err);
        setError("Error fetching playlist: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [emotion]);

  PlaylistDisplay.propTypes = {
    emotion: PropTypes.shape({
      results: PropTypes.arrayOf(
        PropTypes.shape({
          emotion: PropTypes.string,
          confidence: PropTypes.number,
          position: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
            width: PropTypes.number,
            height: PropTypes.number,
          }),
        })
      ),
    }),
  };

  PlaylistDisplay.defaultProps = {
    emotion: {
      results: [
        {
          emotion: "neutral",
        },
      ],
    },
  };

  if (loading) {
    return (
      <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-center">
        <Loader className="animate-spin text-blue-400" size={40} />
        <p className="text-blue-400 ml-2">Fetching playlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-700 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-red-400">Error</h2>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="bg-gray-700 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-white">
          🎵 Emotion Playlist
        </h2>
        <p className="text-gray-400">
          No playlist available for the detected emotion.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h2 className="text-xl font-semibold text-white flex items-center">
        <Music className="mr-2 text-yellow-400" />
        Emotion Playlist
      </h2>
      <div className="flex flex-col items-center">
        <img
          src={playlist.image_url || "https://via.placeholder.com/300"} // Handle missing image
          alt="playlist cover"
          className="w-full max-w-sm rounded-lg"
        />
        <p className="mt-4 text-lg font-medium text-center text-white">
          {playlist.name}
        </p>
        <a
          href={playlist.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline text-center mt-2"
        >
          Open in Spotify
        </a>
      </div>
    </div>
  );
};
