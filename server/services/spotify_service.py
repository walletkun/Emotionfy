from flask import Blueprint, jsonify

spotify_bp = Blueprint('spotify', __name__)

@spotify_bp.route('/status', methods=['GET'])
def status():
    """Test endpoint to verify Spotify service is reachable"""
    return jsonify({
        'status': 'success',
        'message': 'Spotify service placeholder - not yet implemented'
    })

@spotify_bp.route('/recommendations', methods=['GET'])
def get_recommendations():
    """Placeholder for getting Spotify recommendations"""
    return jsonify({
        'status': 'not_implemented',
        'message': 'Spotify recommendations coming soon'
    })