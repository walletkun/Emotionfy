import cv2 
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import os

class EmotionService:
    def __init__(self):
        # Get the absolute path to the project root
        self.project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        # Load face cascade classifier
        cascade_path = os.path.join(self.project_root, 'models', 'data', 'cascades', 'haarcascade_frontalface_default.xml')
        self.face_cascade = cv2.CascadeClassifier(cascade_path)
        
        # Update this line to use the new h5 file
        model_path = os.path.join(self.project_root, 'models', 'fixed_emotion_model.h5')
        self.emotion_model = tf.keras.models.load_model(model_path)
        
        # Define emotions (make sure this matches your training data order)
        self.emotions = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
        
        # Initialize emotion stats
        self.emotion_stats = {emotion: 0 for emotion in self.emotions}
        self.total_predictions = 0

    def preprocess_face(self, face_img):
        """Preprocess face image for emotion detection"""
        try:
            # Resize to match model input size
            resized = cv2.resize(face_img, (48, 48))
            
            # Convert to grayscale if the image is in color
            if len(resized.shape) == 3:
                resized = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
            
            # Normalize pixel values
            normalized = resized.astype('float32') / 255.0
            
            # Reshape for model input (batch_size, height, width, channels)
            processed = normalized.reshape(1, 48, 48, 1)
            
            return processed
        except Exception as e:
            print(f"Error preprocessing face: {str(e)}")
            return None

    def detect_emotion(self, frame):
        """Detect emotion from face image"""
        try:
            # Convert frame to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Detect faces
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30)
            )
            
            results = []
            
            for (x, y, w, h) in faces:
                # Extract face ROI
                face_roi = frame[y:y+h, x:x+w]
                
                # Preprocess face
                processed_face = self.preprocess_face(face_roi)
                if processed_face is None:
                    continue
                
                # Predict emotion
                prediction = self.emotion_model.predict(processed_face, verbose=0)
                emotion_idx = np.argmax(prediction[0])
                emotion = self.emotions[emotion_idx]
                confidence = float(prediction[0][emotion_idx])
                
                # Update statistics
                self.emotion_stats[emotion] += 1
                self.total_predictions += 1
                
                results.append({
                    'emotion': emotion,
                    'confidence': confidence,
                    'position': {
                        'x': int(x),
                        'y': int(y),
                        'width': int(w),
                        'height': int(h)
                    }
                })
            
            return results
        
        except Exception as e:
            print(f"Error detecting emotion: {str(e)}")
            return []

    def get_top_emotions(self, n=10):
        """Get top N emotions based on historical predictions"""
        if self.total_predictions == 0:
            return []
            
        emotion_percentages = {
            emotion: (count/self.total_predictions) * 100
            for emotion, count in self.emotion_stats.items()
        }
        
        top_emotions = sorted(
            emotion_percentages.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        return top_emotions[:n]

    def reset_stats(self):
        """Reset emotion statistics"""
        self.emotion_stats = {emotion: 0 for emotion in self.emotions}
        self.total_predictions = 0