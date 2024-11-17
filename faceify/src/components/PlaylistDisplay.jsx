import React from 'react';
import { Music, Play } from 'lucide-react';

export const PlaylistDisplay = ({ emotion }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Music className="mr-2" />
        Emotion Playlist
      </h2>
      <div className="relative group">
        <img
          src="/api/placeholder/300/300"
          alt={`${emotion || 'Upload image'} playlist`}
          className="rounded-lg object-cover w-full aspect-square"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
          <Play className="text-white" size={48} />
        </div>
        <p className="mt-4 text-lg font-medium text-center capitalize">
          {emotion ? `${emotion} Vibes` : 'Upload an image to get started'}
        </p>
        <p className="text-sm text-gray-400 text-center">Spotify Playlist</p>
      </div>
    </div>
  );
};