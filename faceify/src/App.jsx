import React from "react"
import { Camera, Music, Github, Play } from "lucide-react"

export default function Component() {
  const detectedEmotion = "Happy"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-center">Emotionify</h1>
        <p className="text-xl text-center text-gray-400">Detect emotions, discover music</p>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-700 rounded-lg p-4 aspect-video flex items-center justify-center">
              <Camera className="w-16 h-16 text-gray-500" />
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-2xl font-semibold mb-2">Detected Emotion</h2>
              <p className="text-4xl font-bold text-blue-400">{detectedEmotion}</p>
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Music className="mr-2" />
              Emotion Playlist
            </h2>
            <div className="relative group">
              <img
                src="/placeholder.svg?height=300&width=300"
                alt={`${detectedEmotion} playlist`}
                width={300}
                height={300}
                className="rounded-lg object-cover w-full aspect-square"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <Play className="text-white" size={48} />
              </div>
              <p className="mt-4 text-lg font-medium text-center">{detectedEmotion} Vibes</p>
              <p className="text-sm text-gray-400 text-center">Spotify Playlist</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 border-t border-gray-700">
        <div className="text-center text-gray-400 mb-4">
          <p>Emotion Detection CV CNN Model with Spotify Integration</p>
          <a
            href="https://github.com/walletkun/faceify"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Github className="mr-1" size={16} />
            View on GitHub
          </a>
        </div>
        <div className="text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Lucas Yao, Rey Reyes, Fei Lin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

