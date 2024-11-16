from flask import Blueprint, request, jsonify, current_app
import cv2
import numpy as np
import traceback
import base64
from server.services.emotion_service import EmotionService

emotion_bp = Blueprint('emotion', __name__)
emotion_service = EmotionService()

@emotion_bp.route('/analyze', methods=['POST'])
def analyze_emotion():
    """Handle both image upload and camera frame analysis"""
    try:
        # Debug request information
        print("Request received:")
        print(f"Content-Type: {request.content_type}")
        print(f"Files: {request.files}")
        print(f"Is JSON: {request.is_json}")
        
        if 'image' in request.files:
            # Handle file upload
            file = request.files['image']
            print(f"Received file: {file.filename}")
            
            # Read file data
            file_data = file.read()
            print(f"File data size: {len(file_data)} bytes")
            
            # Convert to image
            nparr = np.frombuffer(file_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is None:
                print("Failed to decode image")
                return jsonify({'error': 'Failed to decode image'}), 400
                
            print(f"Decoded image shape: {frame.shape}")
            
        elif request.is_json and 'frame' in request.json:
            # Handle base64 camera frame
            frame_data = request.json['frame'].split(',')[1]
            nparr = np.frombuffer(base64.b64decode(frame_data), np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        else:
            return jsonify({'error': 'No image or frame provided'}), 400

        if frame is None:
            return jsonify({'error': 'Invalid image format'}), 400

        # Detect emotion
        results = emotion_service.detect_emotion(frame)
        print(f"Emotion detection results: {results}")
        
        if not results:
            return jsonify({'error': 'No faces detected'}), 404

        response = {
            'results': results,
            'top_emotions': emotion_service.get_top_emotions()
        }
        print(f"Sending response: {response}")
        return jsonify(response)

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@emotion_bp.route('/test', methods=['GET'])
def test():
    """Test endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'Emotion service is running'
    })