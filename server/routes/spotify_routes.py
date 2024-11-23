from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from server.services.spotify_service import fetch_playlists_by_emotion

spotify_bp = Blueprint('spotify', __name__)

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
    "angry": [{
        "name": "Rage Beats",
        "url": "https://open.spotify.com/playlist/37i9dQZF1DX6MX4eEGnZFr",
        "image_url": "https://i.scdn.co/image/ab67706f00000003b96a007cd79f7cbf8ae83cd6"
    }],
    "fear": [{
        "name": "Calm Down",
        "url": "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
        "image_url": "https://i.scdn.co/image/ab67706f000000034d26d431869cabfc53c67d8e"
    }],
    "disgust": [{
        "name": "Clean Vibes",
        "url": "https://open.spotify.com/playlist/37i9dQZF1DX6VdMW310YC7",
        "image_url": "https://i.scdn.co/image/ab67706f00000003eaaf71614a60902f12951500"
    }],
    "surprise": [{
        "name": "Discover Weekly",
        "url": "https://open.spotify.com/playlist/37i9dQZF1DX6PdsVYbP4rI",
        "image_url": "https://i.scdn.co/image/ab67706f0000000318b8888a39e56ab0e6e1785c"
    }]
}

@spotify_bp.route('/test', methods=['GET'])
def test():
    """Test endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'Spotify routes working'
    })

@spotify_bp.route('/recommendations', methods=['POST', 'OPTIONS'])
@cross_origin()
def get_recommendations():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        print("Recommendations endpoint hit!")
        data = request.get_json()
        print("Request data:", data)

        if not data or 'emotion' not in data:
            return jsonify({"error": "Emotion is required"}), 400

        emotion = data['emotion'].lower()
        print(f"Processing emotion: {emotion}")

        # Try to get playlists from Spotify API
        playlists = fetch_playlists_by_emotion(emotion)
        
        # If Spotify API fails or returns no playlists, use fallback
        if not playlists:
            print(f"Using fallback playlist for {emotion}")
            playlists = DEFAULT_PLAYLISTS.get(emotion, DEFAULT_PLAYLISTS['neutral'])

        print(f"Returning playlists: {playlists}")
        return jsonify(playlists)

    except Exception as e:
        print(f"Error in recommendations: {str(e)}")
        # Return fallback playlist on error
        emotion = request.get_json().get('emotion', 'neutral').lower()
        return jsonify(DEFAULT_PLAYLISTS.get(emotion, DEFAULT_PLAYLISTS['neutral']))