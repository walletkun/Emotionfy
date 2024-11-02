from flask import Blueprint, request, jsonify
import cv2 
import numpy as np
from services.emotion_service import EmotionService


emotion_bp =Blueprint('emotion', __name__)
emotion_service = EmotionService()

@emotion_bp.route('/analyze', methods=['POST'])
def analyze_emotion():
    '''Analyze emotion from image'''
    #Get the image from request
    file = request.files.get('image')
    if not file:
        return jsonify({'error': 'No image provided'}), 400



    #Convert image to OpenCV format
    nparr = np.fromstring(file.read(), np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    #Detect emotion
    results = emotion_service.detect_emotion(frame)


    return jsonify({
        'results': results,
        'top_emotions': emotion_service.get_top_emotions()
    })




@emotion_bp.route('/stats', methods=['GET'])
def get_emotion_stats():
    '''Get emotion statistics'''
    return jsonify({
        'top_emotions': emotion_service.get_top_emotions(),
        'total_predictions': emotion_service.total_predictions})



@emotion_bp.route('/reset', methods=['POST'])
def reset_stats():
    '''Reset emotion statistics'''
    emotion_service.reset_stats()
    return jsonify({'message': 'Statistics reset successfully'})

