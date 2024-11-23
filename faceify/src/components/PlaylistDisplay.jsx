import React, { useEffect, useState } from "react";
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
        const response = await fetch("http://127.0.0.1:5001/spotify/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emotion }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch playlist. Status: ${response.status}`);
        }

        const playlists = await response.json();

        if (playlists.length > 0) {
          setPlaylist(playlists[0]); // Use the first playlist in the response
        } else {
          setPlaylist(null);
        }
      } catch (err) {
        console.error("Error fetching playlist:", err.message);
        setError("Error fetching playlist: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [emotion]);

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
        <h2 className="text-xl font-semibold text-white">🎵 Emotion Playlist</h2>
        <p className="text-gray-400">No playlist available for the detected emotion.</p>
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
        <p className="mt-4 text-lg font-medium text-center text-white">{playlist.name}</p>
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
