import React from 'react';
import { Github } from 'lucide-react';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-center">Emotionify</h1>
        <p className="text-xl text-center text-gray-400">Detect emotions, discover music</p>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
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
  );
};