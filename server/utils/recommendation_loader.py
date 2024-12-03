import os

def load_music_recommendations(filepath):
    recommendations = {}
    with open(filepath, 'r') as file:
        for line in file:
            mood, songs = line.strip().split(':')
            recommendations[mood.strip()] = [song.strip() for song in songs.split(',')]
    return recommendations

# Example Usage
recommendations = load_music_recommendations('Music_recommendation.txt')
