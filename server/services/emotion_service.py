import cv2 
import numpy as np
from tensorflow.keras.models import load_model
import os



class EmotionService:

    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        #Load emotion detection model
        model_path = os.path.join('models', 'saved_models', 'emotion_cnn.h5')
        self.emotion_model = load_model(model_path)

        #Define emotions
        self.emotions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

        #initialize emotion stats
        self.emotion_stats = {emotion: 0 for emotion in self.emotions}
        self.total_predictions = 0


    def preprocess_face(self, face_img):
        '''Preprcess face image for emotion detection'''
        
        #Resize to match model input size
        face_img = cv2.resize(face_img, (48, 48))

        #Convert to gray scale
        face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)

        #Normalize pixel values
        face_img = face_img / 255.0

        #Reshape image to match model input shape
        face_img = np.reshape(face_img, (1, 48, 48, 1))

        return face_img


    def detect_emotion(self, frame):
        '''Detect emotion from face image'''

        #Convert frame to gray scale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        #Detect faces in the frame
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        #Store the result in a list
        results = []

        #iterate over the faces
        for(x,y,w,h) in faces: 
            #Extract the face ROI (Region of Interest)
            face_roi = frame[y:y+h, x:x+w] #Row over column

            #Preprocess the face image
            process_face = self.preprocess_face(face_roi)

            #Predict the emotion
            emotion_prediction = self.emotion_model.predict(process_face)
            emotion_idx = np.argmax(emotion_prediction)
            emotion = self.emotions[emotion_idx]
            confidence = float(emotion_prediction[0][emotion_idx])

            #Update the statistics
            self.emotion_stats[emotion] += 1
            self.total_predictions += 1


            results.append({
                'emotion': emotion,
                'confidence': confidence,
                'position' : (x, y, w, h)
            })



        return results


    def get_top_emotions(self, n =10):
        '''Get top N emotions based on historcal prediction'''

        #If no predictions have been made, return an empty list
        if self.total_predictions == 0:
            return []


        #calculate the percentage of each emotion
        emotion_percentages = {
            emotion: (count/self.total_predictions) * 100
            for emotion, count in self.emotion_stats.items()}


        #Sort the emotions based on the percentage
        top_emotions = sorted(emotion_percentages.items(), key=lambda x: x[1], reverse=True)


        return top_emotions[:n]


    def reset_stats(self):
        '''Reset the emotion statistics'''

        self.emotion_stats = {emotion: 0 for emotion in self.emotions}
        self.total_predictions = 0