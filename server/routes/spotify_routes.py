import traceback
import logging
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from server.services.spotify_service import fetch_playlists_by_emotion, get_spotify_client, test_spotify_connection

spotify_bp = Blueprint('spotify', __name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Fallback playlists when Spotify API fails
DEFAULT_PLAYLISTS = {
    "happy": [{
        "name": "Happy Hits",
        "url": "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC",
        "image_url": "https://i.scdn.co/image/ab67706f00000003bd0e19e810bb4b55ab164a95"
    }],
    "sad": [{
        "name": "Sad Songs",
        "url": "https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1",
        "image_url": "https://i.scdn.co/image/ab67706f00000003984538c06903f61246f8ec72"
    }],
    "neutral": [{
        "name": "Chill Vibes",
        "url": "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0",
        "image_url": "https://i.scdn.co/image/ab67706f00000003e4b3ef11062b561c75c3408a"
    }],
    # ... [keep other default playlists] ...
}

@spotify_bp.before_request
def log_request():
    if request.method != 'OPTIONS':
        logger.info(f"Request: {request.method} {request.url}")
        if request.get_json():
            logger.info(f"Request body: {request.get_json()}")

@spotify_bp.after_request
def log_response(response):
    if request.method != 'OPTIONS':
        logger.info(f"Response status: {response.status}")
    return response

@spotify_bp.route('/auth', methods=['GET'])
@cross_origin()
def get_auth():
    logger.info("Attempting Spotify authentication")
    sp = get_spotify_client()
    if sp:
        token = sp.auth_manager.get_access_token()['access_token']
        logger.info("Successfully obtained Spotify token")
        return jsonify({'token': token})
    logger.error("Spotify authentication failed")
    return jsonify({'error': 'Authentication failed'}), 401

@spotify_bp.route('/recommendations', methods=['POST', 'OPTIONS'])
@cross_origin()
def get_recommendations():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        # Validate request
        data = request.get_json()
        if not data or 'emotion' not in data:
            logger.error("Missing emotion in request")
            return jsonify({"error": "Emotion is required"}), 400

        emotion = data['emotion'].lower()
        logger.info(f"Processing recommendation request for emotion: {emotion}")

        # Test Spotify connection
        if not test_spotify_connection():
            logger.error("Spotify connection test failed")
            return jsonify({"error": "Spotify service unavailable"}), 503

        # Fetch playlists
        playlists = fetch_playlists_by_emotion(emotion)
        
        # Use fallback only if no playlists found
        if not playlists:
            logger.warning(f"No playlists found for {emotion}, using fallback")
            return jsonify(DEFAULT_PLAYLISTS.get(emotion, DEFAULT_PLAYLISTS['neutral']))
            
        logger.info(f"Successfully fetched {len(playlists)} playlists for {emotion}")
        return jsonify(playlists)

    except Exception as e:
        logger.error(f"Error in recommendations: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": "Failed to fetch recommendations"}), 500

@spotify_bp.route('/callback')
def spotify_callback():
    return jsonify({"status": "success"}), 200