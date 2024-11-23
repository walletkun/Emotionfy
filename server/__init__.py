import os
import sys
from flask import Flask, send_file, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from io import BytesIO
import numpy as np
from PIL import Image

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

load_dotenv()

def create_app(test_config=None):
    app = Flask(__name__)
    
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5174"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Accept"],
            "supports_credentials": True,
        }
    })

    # Add placeholder endpoint
    @app.route('/api/placeholder/<int:width>/<int:height>')
    def placeholder(width, height):
        # Create a gray placeholder image
        img = Image.new('RGB', (width, height), color='gray')
        img_io = BytesIO()
        img.save(img_io, 'PNG')
        img_io.seek(0)
        return send_file(img_io, mimetype='image/png')

    if test_config is None:
        app.config.from_mapping(
            SECRET_KEY=os.getenv('SECRET_KEY', 'dev')
        )
    else:
        app.config.update(test_config)
    
    try:
        from server.routes.emotion_routes import emotion_bp
        app.register_blueprint(emotion_bp, url_prefix='/api/emotion')
    except ImportError as e:
        print(f"Error importing blueprints: {str(e)}")
        raise
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy', 'message': 'Server is running'}
    
    return app