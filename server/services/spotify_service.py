import os
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth

# Spotify API setup
def get_spotify_client():
    sp = Spotify(auth_manager=SpotifyOAuth(
        client_id=os.getenv("SPOTIFY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
        scope="playlist-read-private"
    ))
    return sp

# Function to fetch playlists based on the emotion
def fetch_playlists_by_emotion(emotion):
    sp = get_spotify_client()

    # Search for playlists based on the emotion
    query = f"{emotion} music"
    results = sp.search(q=query, type='playlist', limit=5)

    playlists = []
    for item in results['playlists']['items']:
        playlists.append({
            "name": item['name'],
            "url": item['external_urls']['spotify'],
            "image_url": item['images'][0]['url'] if item['images'] else None,
            "description": item.get('description', '')
        })
    return playlists
