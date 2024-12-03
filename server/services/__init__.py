from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

def create_app(test_config=None):
    app = Flask(__name__)
    CORS(app)
    
    # Register blueprints
    from .routes.emotion_routes import emotion_bp
    from .routes.spotify_routes import spotify_bp
    from routes.chatbot_routes import chatbot_bp

    app.register_blueprint(chatbot_bp, url_prefix='/api')

    app.register_blueprint(emotion_bp, url_prefix='/api/emotion')
    app.register_blueprint(spotify_bp, url_prefix='/api/spotify')
    
    return app

