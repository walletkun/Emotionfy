import os
import sys
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Add the server directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

# Load environment variables
load_dotenv()

def create_app(test_config=None):
    # Create Flask app instance
    app = Flask(__name__)

    # Configure CORS
    CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])

    # Set up configuration
    if test_config is None:
        app.config.from_mapping(
            SECRET_KEY=os.getenv('SECRET_KEY', 'dev')
        )
    else:
        app.config.update(test_config)

    try:
        # Initialize emotion blueprint only
        from server.routes.emotion_routes import emotion_bp
        app.register_blueprint(emotion_bp, url_prefix='/api/emotion')
        
    except ImportError as e:
        print(f"Error importing blueprints: {str(e)}")
        raise

    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy', 'message': 'Server is running'}

    return app