from .emotion_routes import emotion_bp
from .spotify_routes import spotify_bp
# This file can be empty or include imports for route modules
from .chatbot_routes import chatbot_bp

__all__ = ['emotion_bp', 'spotify_bp', 'chatbot_bp']

