import os
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv

load_dotenv()

def get_spotify_client():
    try:
        client_credentials_manager = SpotifyClientCredentials(
            client_id=os.getenv('SPOTIFY_CLIENT_ID'),
            client_secret=os.getenv('SPOTIFY_CLIENT_SECRET')
        )
        return Spotify(client_credentials_manager=client_credentials_manager)
    except Exception as e:
        print(f"Spotify authentication error: {str(e)}")
        return None

def get_emotion_query(emotion):
    emotion_map = {
        'fear': 'calming anxiety relief relaxation',
        'happy': 'happy upbeat feel good mood booster',
        'sad': 'sad heartbreak melancholy comfort',
        'angry': 'calming peaceful stress relief',
        'neutral': 'chill lofi ambient focus',
        'disgust': 'uplifting positive clean',
        'surprise': 'energetic exciting upbeat'
    }
    return emotion_map.get(emotion, 'neutral')

def fetch_playlists_by_emotion(emotion):
    try:
        sp = get_spotify_client()
        if not sp:
            print("Failed to get Spotify client")
            return []

        query = f'{get_emotion_query(emotion)} playlist'
        print(f"Searching for: {query}")
        
        results = sp.search(
            q=query,
            type='playlist',
            limit=10,
            market='US'
        )
        
        playlists = []
        for item in results['playlists']['items']:
            if item is not None:
                playlist_details = sp.playlist(item['id'])
                followers = playlist_details['followers']['total']
                
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

        playlists.sort(key=lambda x: x['followers'], reverse=True)
        return playlists[:5]

    except Exception as e:
        print(f"Error in fetch_playlists_by_emotion: {str(e)}")
        print(f"Current emotion: {emotion}")
        return []