from flask import Blueprint, request, jsonify
import cv2
import numpy as np
import traceback
import base64
import gc
from server.services.emotion_service import EmotionService

emotion_bp = Blueprint('emotion', __name__)
emotion_service = EmotionService()

@emotion_bp.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze_emotion():
    """Handle both image upload and camera frame analysis"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    frame = None
    nparr = None
    file_data = None

    try:
        # Debug request information
        print("Request received:")
        print(f"Content-Type: {request.content_type}")
        print(f"Files: {request.files}")
        print(f"Headers: {dict(request.headers)}")
        
        if 'image' in request.files:
            # Handle file upload
            file = request.files['image']
            print(f"Received file: {file.filename}")
            
            # Read file data
            file_data = file.read()
            print(f"File data size: {len(file_data)} bytes")
            
            # Convert to image
            nparr = np.frombuffer(file_data, np.uint8).copy()
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is None:
                print("Failed to decode image")
                return jsonify({'error': 'Failed to decode image'}), 400
                
            print(f"Decoded image shape: {frame.shape}")
            frame = frame.copy()
            print(f"Decoded image shape: {frame.shape} ")
        elif request.is_json and 'frame' in request.json:
            # Handle base64 camera frame
            frame_data = request.json['frame'].split(',')[1]
            nparr = np.frombuffer(base64.b64decode(frame_data), np.uint8).copy()
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if frame is not None:
                frame = frame.copy()
        else:
            return jsonify({'error': 'No image or frame provided'}), 400

        if frame is None:
            return jsonify({'error': 'Invalid image format'}), 400

        # Detect emotion
        results = emotion_service.detect_emotion(frame.copy())
        print(f"Emotion detection results: {results}")

        
        
        if not results:
            return jsonify({
                'message': 'No faces detected in frame',
                'results': [],
                'top_emotions': []
            }), 200

        response = {
            'results': results,
            'top_emotions': emotion_service.get_top_emotions()
        }
        print(f"Sending response: {response}")


        if frame is not None:
            del frame
        if nparr is not None:
            del nparr
        if file_data is not None:
            del file_data

        gc.collect()
        
        return jsonify(response)

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")

        if frame is not None:
            del frame
        if nparr is not None:
            del nparr
        if file_data is not None:
            del file_data 
        
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