import cv2 
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import os

class EmotionService:
    def __init__(self):
        self.project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        # Try multiple cascade classifiers
        cascade_paths = [
            "/Users/lucasyao/Documents/GitHub/faceify/server/models/data/cascades/haarcascade_frontalface_default.xml",
            cv2.data.haarcascades + 'haarcascade_frontalface_alt2.xml',
            cv2.data.haarcascades + 'haarcascade_frontalface_alt.xml'
        ]
        
        # Try to load cascade classifiers until one works
        self.face_cascade = None
        for path in cascade_paths:
            if os.path.exists(path):
                cascade = cv2.CascadeClassifier(path)
                if not cascade.empty():
                    self.face_cascade = cascade
                    print(f"Successfully loaded cascade classifier from: {path}")
                    break
                
        if self.face_cascade is None:
            raise Exception("Could not load any face cascade classifier")
        
        model_path = "/Users/lucasyao/Documents/GitHub/faceify/server/models/emotion_recognition_model.h5"
        self.emotion_model = load_model(model_path)
        self.emotions = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
        self.emotion_stats = {emotion: 0 for emotion in self.emotions}
        self.total_predictions = 0

    def preprocess_image(self, image):
        try:
            image_float = image.astype(np.float32) / 255.0
            
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            enhanced = clahe.apply(gray)
            
            denoised = cv2.fastNlMeansDenoising(enhanced)
            
            return denoised
        except Exception as e:
            print(f"Error in preprocess_image: {str(e)}")
            return None

    def preprocess_face(self, face_img):
        try:
            resized = cv2.resize(face_img, (48, 48))
            if len(resized.shape) == 3:
                resized = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
            normalized = resized.astype('float32') / 255.0
            return normalized.reshape(1, 48, 48, 1)
        except Exception as e:
            print(f"Error preprocessing face: {str(e)}")
            return None

    def detect_faces_with_multiple_params(self, gray):
        """Try multiple parameter combinations for face detection"""
        param_sets = [
            {'scaleFactor': 1.05, 'minNeighbors': 3, 'minSize': (20, 20), 'maxSize': (400, 400)},
            {'scaleFactor': 1.1, 'minNeighbors': 5, 'minSize': (30, 30), 'maxSize': (300, 300)},
            {'scaleFactor': 1.15, 'minNeighbors': 4, 'minSize': (40, 40), 'maxSize': (500, 500)}
        ]
        
        for params in param_sets:
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=params['scaleFactor'],
                minNeighbors=params['minNeighbors'],
                minSize=params['minSize'],
                maxSize=params['maxSize']
            )
            if len(faces) > 0:
                print(f"Found faces with params: {params}")
                return faces
        return np.array([])

    def detect_emotion(self, frame):
        try:
            # Print original dimensions
            print(f"Original image shape: {frame.shape}")

            # Standardize image size to a reasonable dimension
            target_width = 500
            aspect_ratio = frame.shape[1] / frame.shape[0]
            target_height = int(target_width / aspect_ratio)
            
            # Resize image while maintaining aspect ratio
            frame = cv2.resize(frame, (target_width, target_height))
            print(f"Resized image shape: {frame.shape}")

            # Convert to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Enhance image for better face detection
            gray = cv2.equalizeHist(gray)
            gray = cv2.GaussianBlur(gray, (3, 3), 0)  # Slight blur to reduce noise
            
            # Parameters optimized for baby faces
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.05,        
                minNeighbors=3,         
                minSize=(50, 50),       
                maxSize=(int(target_width * 0.95), int(target_width * 0.95)) 
            )
            
            # If no faces found, try alternate parameters
            if len(faces) == 0:
                print("No faces found with initial parameters, trying alternate parameters...")
                faces = self.face_cascade.detectMultiScale(
                    gray,
                    scaleFactor=1.03,    # Even more gradual scaling
                    minNeighbors=2,      # More lenient
                    minSize=(40, 40),    # Even smaller minimum size
                    maxSize=(int(target_width * 0.95), int(target_width * 0.95))
                )
            
            # Sort faces by area and take the largest one
            if len(faces) > 0:
                faces = sorted(faces, key=lambda x: x[2] * x[3], reverse=True)
                faces = faces[:1]  # Take only the largest face
                print(f"Found face with dimensions: w={faces[0][2]}, h={faces[0][3]}")
            
            results = []
            
            for (x, y, w, h) in faces:
                # Add padding around the face
                padding = int(0.1 * w)  # 10% padding
                x1 = max(0, x - padding)
                y1 = max(0, y - padding)
                x2 = min(frame.shape[1], x + w + padding)
                y2 = min(frame.shape[0], y + h + padding)
                
                face_roi = frame[y1:y2, x1:x2]
                
                # Debug: Save the detected face region
                cv2.imwrite('debug_face.jpg', face_roi)
                
                processed_face = self.preprocess_face(face_roi)
                if processed_face is None:
                    continue
                
                prediction = self.emotion_model.predict(processed_face, verbose=0)
                emotion_idx = np.argmax(prediction[0])
                emotion = self.emotions[emotion_idx]
                confidence = float(prediction[0][emotion_idx])
                
                self.emotion_stats[emotion] += 1
                self.total_predictions += 1
                
                results.append({
                    'emotion': emotion,
                    'confidence': confidence,
                    'position': {
                        'x': int(x1),
                        'y': int(y1),
                        'width': int(x2-x1),
                        'height': int(y2-y1)
                    }
                })
            
            print(f"Number of faces detected after filtering: {len(results)}")
            if len(results) == 0:
                print("No faces detected. Check face detection parameters.")
            
            return results
        
        except Exception as e:
            print(f"Error detecting emotion: {str(e)}")
            import traceback
            traceback.print_exc()
            return []

    def get_top_emotions(self, n=10):
        if self.total_predictions == 0:
            return []
        
        emotion_percentages = {
            emotion: (count/self.total_predictions) * 100
            for emotion, count in self.emotion_stats.items()
        }
        
        return sorted(
            emotion_percentages.items(),
            key=lambda x: x[1],
            reverse=True
        )[:n]

    def reset_stats(self):
        self.emotion_stats = {emotion: 0 for emotion in self.emotions}
        self.total_predictions = 0