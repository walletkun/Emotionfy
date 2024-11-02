from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

#Load environment variables
load_dotenv()

def create_app(test_config=None):
    #Create Flask app instance
    app = Flask(__name__)


    #Configure CORS
    CORS(app, origins=os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000'))

    #Set up configuration
    if test_config is None:
        app.config.from_mapping(
            SECRET_KEY=os.getenv('SECRET_KEY','dev'),
            KAGGLE_USERNAME=os.getenv('KAGGLE_USERNAME'),
            KAGGLE_KEY=os.getenv('KAGGLE_KEY')
        )

    else:
        app.config.update(test_config)

    
    os.environ['KAGGLE_USERNAME'] = os.getenv('KAGGLE_USERNAME')
    os.environ['KAGGLE_KEY'] = os.getenv('KAGGLE_KEY')



    #Initialize blue prints
    from .routes.emotion_routes import emotion_bp
    from .routes.spotify_routes import spotify_bp


    #Register blueprints
    app.register_blueprint(emotion_bp, url_prefix='/api/emotion')
    app.register_blueprint(spotify_bp, url_prefix='/api/spotify')


    return app


#Import the service modules from Service/emotion_service.py and Service/spotify_service.py
from flask import Blueprint, jsonify, request
from services.emotion_service import EmotionService
from services.spotify_service import SpotifyService


emotion_bp = Blueprint('emotion', __name__)
emotion_service = EmotionService()
spotify_service = SpotifyService()


@emotion_bp.route('/get_emotion', methods=['POST'])
def analyze_emotion():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image = request.files['image']
    emotion = emotion_service.get_emotion(image)


    #Get music recommendation based on emotion
    music_recommendation = spotify_service.get_recommendation(emotion)


    return jsonify({
        'emotion': emotion,
        'recommendations': music_recommendation
    })



