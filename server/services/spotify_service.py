import os
import logging
import traceback
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

def get_spotify_client():
    """Initialize and return Spotify client with proper error handling"""
    try:
        client_credentials_manager = SpotifyClientCredentials(
            client_id=os.getenv('SPOTIFY_CLIENT_ID'),
            client_secret=os.getenv('SPOTIFY_CLIENT_SECRET')
        )
        return Spotify(client_credentials_manager=client_credentials_manager)
    except Exception as e:
        logger.error(f"Spotify authentication error: {str(e)}\n{traceback.format_exc()}")
        return None

def test_spotify_connection():
    """Test if Spotify API is accessible and working"""
    sp = get_spotify_client()
    if not sp:
        return False
    
    try:
        sp.search(q="test", limit=1)
        return True
    except Exception as e:
        logger.error(f"Spotify API test failed: {str(e)}")
        return False

def get_emotion_query(emotion):
    """Generate a more diverse search query for each emotion"""
    emotion_map = {
        'fear': ['calming', 'relaxation', 'peaceful', 'meditation'],
        'happy': ['happy', 'upbeat', 'joy', 'cheerful', 'feel good'],
        'sad': ['sad', 'melancholy', 'heartbreak', 'emotional'],
        'angry': ['angry', 'intense', 'powerful', 'energetic'],
        'neutral': ['chill', 'ambient', 'focus', 'background'],
        'disgust': ['clean', 'positive', 'fresh', 'uplifting'],
        'surprise': ['surprise', 'exciting', 'unexpected', 'dynamic']
    }
    
    keywords = emotion_map.get(emotion, ['neutral', 'chill'])
    # Use random combinations of keywords for more variety
    from random import sample
    selected_keywords = sample(keywords, min(3, len(keywords)))
    return ' OR '.join(selected_keywords) + ' playlist'

def validate_spotify_response(results):
    """Validate Spotify API response"""
    if not results or 'playlists' not in results:
        raise ValueError("Invalid response from Spotify API")
    
    if not results['playlists']['items']:
        raise ValueError("No playlists found")

def fetch_playlists_by_emotion(emotion):
    """Fetch and process playlists from Spotify with improved error handling and logging"""
    try:
        sp = get_spotify_client()
        if not sp:
            logger.error("Failed to initialize Spotify client")
            return []

        query = get_emotion_query(emotion)
        logger.info(f"Searching Spotify with query: {query}")
        
        results = sp.search(
            q=query,
            type='playlist',
            limit=10,
            market='US'
        )
        
        validate_spotify_response(results)
        
        playlists = []
        for item in results['playlists']['items']:
            try:
                if item is None:
                    continue

                playlist_details = sp.playlist(item['id'])
                followers = playlist_details['followers']['total']
                
                # Fetch first track details
                tracks = sp.playlist_tracks(item['id'], limit=1)
                track_info = None
                
                if tracks['items'] and tracks['items'][0]['track']:
                    track = tracks['items'][0]['track']
                    track_info = {
                        'name': track['name'],
                        'duration': track['duration_ms'] // 1000,
                        'artist': track['artists'][0]['name'],
                        'uri': track['uri']
                    }

                playlist = {
                    "name": item['name'],
                    "url": item['external_urls']['spotify'],
                    "image_url": item['images'][0]['url'] if item.get('images') else None,
                    "followers": followers,
                    "track": track_info,
                    "uri": item['uri']
                }
                playlists.append(playlist)
                
            except Exception as e:
                logger.error(f"Error processing playlist {item.get('id')}: {str(e)}")
                continue

        # Sort by followers but add some randomization for variety
        from random import shuffle
        top_playlists = sorted(playlists, key=lambda x: x['followers'], reverse=True)[:10]
        shuffle(top_playlists)
        return top_playlists[:5]

    except Exception as e:
        logger.error(f"Error in fetch_playlists_by_emotion: {str(e)}\n{traceback.format_exc()}")
        return []