import os
import sys
from flask import Flask, send_file, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

def create_app(test_config=None):
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5174"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Accept"],
            "supports_credentials": True,
        }
    })

    try:
        # Import and register blueprints
        from server.routes.emotion_routes import emotion_bp
        from server.routes.spotify_routes import spotify_bp
        from server.routes.chatbot_routes import chatbot_bp
        app.register_blueprint(chatbot_bp, url_prefix='/api')
        print("Chatbot blueprint registered at /api/chat")
        app.register_blueprint(emotion_bp, url_prefix='/api/emotion')
        app.register_blueprint(spotify_bp, url_prefix='/api/spotify')

        # Print registered routes for debugging
        print("\nRegistered routes:")
        for rule in app.url_map.iter_rules():
            print(f"{rule.methods} {rule.rule}")
            
    except ImportError as e:
        print(f"Error importing blueprints: {str(e)}")
        raise

    @app.route('/health')
    def health_check():
        return jsonify({'status': 'healthy'})

    return app