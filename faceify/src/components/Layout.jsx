import React from "react";
import { Github } from "lucide-react";

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white flex flex-col">
      <header className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
          Emotionify
        </h1>
        <p className="text-2xl text-center text-gray-300">
          Detect emotions, discover music
        </p>
      </header>

      <main className="container mx-auto px-4 py-12 flex-grow">{children}</main>

      <footer className="container mx-auto px-4 py-8 border-t border-gray-700/50">
        <div className="text-center text-gray-300 mb-4">
          <p className="mb-2">
            Emotion Detection CV CNN Model with Spotify Integration
          </p>
          <a
            href="https://github.com/walletkun/faceify"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Github className="mr-2" size={18} />
            View on GitHub
          </a>
        </div>
        <div className="text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Lucas Yao, Rey Reyes, Fei Lin. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
