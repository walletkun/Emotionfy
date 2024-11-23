from flask import Blueprint, jsonify, request

spotify_bp = Blueprint('spotify', __name__)

# Define the playlists_by_emotion mapping
playlists_by_emotion = {
    "angry": [
        {
            "name": "Angry Beats",
            "url": "https://open.spotify.com/playlist/37i9dQZF1DX8ucVJaqqjpS",  # Valid Spotify playlist URL
        }
    ],
    "neutral": [
        {
            "name": "Neutral Vibes",
            "url": "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0",  # Valid Spotify playlist URL
        }
    ],
    "happy": [
        {
            "name": "Happy Tunes",
            "url": "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC",  # Valid Spotify playlist URL
        }
    ],
    "surprise": [
        {
            "name": "Surprise Hits",
            "url": "https://open.spotify.com/playlist/37i9dQZF1DX6PdsVYbP4rI",  # Valid Spotify playlist URL
        }
    ],
}

# Define the route for playlist recommendations
@spotify_bp.route('/recommendations', methods=['POST'])
def get_recommendations():
    """Fetch Spotify playlists based on emotion."""
    # Parse the incoming JSON request
    data = request.get_json()
    emotion = data.get('emotion')  # Extract the emotion from the request body

    # If no emotion is provided, return an error response
    if not emotion:
        return jsonify({"error": "Emotion is required"}), 400

    # Fetch the playlists corresponding to the emotion
    playlists = playlists_by_emotion.get(emotion, [])

    # Return the playlists as a JSON response
    return jsonify(playlists)