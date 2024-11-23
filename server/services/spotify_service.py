import os
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_spotify_client():
    try:
        # Check if environment variables are set
        client_id = os.getenv("SPOTIFY_CLIENT_ID")
        client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
        redirect_uri = os.getenv("SPOTIFY_REDIRECT_URI")

        print("Spotify Credentials Check:")
        print(f"Client ID exists: {bool(client_id)}")
        print(f"Client Secret exists: {bool(client_secret)}")
        print(f"Redirect URI: {redirect_uri}")

        if not all([client_id, client_secret, redirect_uri]):
            print("Missing Spotify credentials!")
            return None

        sp = Spotify(auth_manager=SpotifyOAuth(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri=redirect_uri,
            scope="playlist-read-private"
        ))
        print("Spotify client created successfully")
        return sp
    except Exception as e:
        print(f"Error creating Spotify client: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return None

def fetch_playlists_by_emotion(emotion):
    try:
        print(f"\nFetching playlists for emotion: {emotion}")
        sp = get_spotify_client()
        
        if not sp:
            print("No Spotify client available")
            return []

        query = f"{emotion} music"
        print(f"Searching with query: {query}")
        
        results = sp.search(q=query, type='playlist', limit=5)
        print(f"Search results received: {bool(results)}")

        playlists = []
        for item in results['playlists']['items']:
            playlist = {
                "name": item['name'],
                "url": item['external_urls']['spotify'],
                "image_url": item['images'][0]['url'] if item['images'] else None,
                "description": item.get('description', '')
            }
            playlists.append(playlist)
            print(f"Added playlist: {playlist['name']}")

        print(f"Total playlists found: {len(playlists)}")
        return playlists
        
    except Exception as e:
        print(f"Error fetching playlists: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return []