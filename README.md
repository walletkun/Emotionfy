# Emotionfy


## Emotion-Driven Playlist Recommendation System 🎵

INTRODUCTION

<p> <strong>Emotionfy</strong> is a cutting-edge system that merges the power of emotion detection with personalized music recommendations. Using deep learning for facial emotion recognition and Spotify’s API, this application recommends playlists tailored to the user’s emotional state. Upload an image, and <strong>Emotionfy</strong> will do the rest — analyzing your emotion and curating a playlist to match your mood. </p>
TEAM MEMBERS

<p><strong>Rey Reyes</strong>: CNN Researcher, Backend Developer <br> <strong>Lucas Yao</strong>: Backend Developer, Frontend Support <br> <strong>Fei Lin</strong>: Frontend Developer, Backend Support </p>
DATASETS USED

<p> 1. <a href="https://www.kaggle.com/datasets/ananthu017/emotion-detection-fer">Emotion Detection FER Dataset</a> <br> This dataset contains 35,887 grayscale 48x48 pixel images labeled with the following emotions: - Angry - Disgust - Fear - Happy - Neutral - Sad - Surprise </p> <p> 2. <a href="https://www.kaggle.com/datasets/jonathanoheix/face-expression-recognition-dataset">Face Expression Recognition Dataset</a> <br> A complementary dataset designed for facial emotion recognition tasks. </p>
GOAL

<p> To enhance emotion detection by integrating Spotify's API, <strong>Emotionfy</strong> recommends playlists based on user emotions. The deep learning model analyzes facial expressions and maps them to Spotify playlists, offering a seamless blend of technology and music personalization. </p>
MODEL ARCHITECTURE

<p> <strong>Base Model:</strong> Trained a CNN on the FER Kaggle dataset for emotion classification. <br> <strong>Emotion-to-Playlist Mapping:</strong> A custom layer maps detected emotions to Spotify playlists for seamless recommendations. </p>
TECH STACK

Frontend
<p> <a href="https://react.dev/">React</a>: Interactive user interface </p>
Backend
<p>  <a href="https://flask.palletsprojects.com/">Flask</a>: API communication and emotion detection <br>  <a href="https://developer.spotify.com/documentation/web-api/">Spotify Web API</a>: Playlist recommendations </p>
Data Processing
<p>  Data augmentation and preprocessing techniques for improved model generalization </p>
Libraries and Tools
<p>  <a href="https://www.tensorflow.org/">TensorFlow</a> and <a href="https://keras.io/">Keras</a>: Deep learning frameworks <br>  <a href="https://opencv.org/">OpenCV</a>: Image processing <br>  <a href="https://pandas.pydata.org/">Pandas</a> and <a href="https://numpy.org/">Numpy</a>: Data handling <br>  <a href="https://matplotlib.org/">Matplotlib</a> and <a href="https://seaborn.pydata.org/">Seaborn</a>: Data visualization <br>  <a href="https://jupyter.org/">Jupyter Notebook</a>: Model development and experiments </p>
Integration
<p>  <a href="https://developer.spotify.com/documentation/general/guides/authorization-guide/">Spotify OAuth 2.0</a>: Secure user authentication for playlist access <br> Spotify Web Playback SDK: Music playback within the interface </p>
FEATURES

<p> 1. <strong>Emotion Detection</strong> <br>  Analyze facial expressions in images or real-time video streams. <br> Detect and classify emotions such as Happy, Sad, Angry, etc. </p> <p> 2. <strong>Playlist Recommendation</strong> <br>  Fetch Spotify playlists tailored to the detected emotion. <br> Play music directly within the app. </p> <p> 3. <strong>User Interface</strong> <br> Upload images or stream video for real-time emotion analysis. <br>  Display detected emotions with an accompanying playlist. </p>
EVALUATION METRICS

<p>  <strong>Emotion Detection:</strong> Accuracy, precision, recall, F1-score <br>  <strong>Playlist Recommendation:</strong> Relevance and alignment based on user feedback </p>

SETUP INSTRUCTIONS

Requirements
<p>  Python 3.8 or above <br>  Spotify Developer Account (for API integration) </p>
Steps
<p> 1. Clone the repository: <pre> git clone https://github.com/your-username/emotionfy.git cd server </pre> </p> <p> 2. Install dependencies: <pre> pip install -r requirements.txt </pre> </p> <p> 3. Configure Spotify API: <br>  Create a <a href="https://developer.spotify.com/">Spotify Developer Account</a>. <br>  Set up an app and note the <strong>Client ID</strong> and <strong>Client Secret</strong>. <br>  Update the <code>config.py</code> file with these credentials. </p> <p> 4. Run the application: <pre> npm dev run </pre> </p> <p> 5. Run the server: <pre> python3 main.py </pre> </p> 
USER INTERFACE

<p align="center"> <img src="image.png" alt="User Interface Mockup" width="800"/> </p>

FUTURE ENHANCEMENTS

<p>  <strong>User Customization:</strong> Link personal Spotify accounts for tailored recommendations. <br>  <strong>Platform Expansion:</strong> Integration with Apple Music and other music platforms. <br>  <strong>Improved Emotion Detection:</strong> Incorporate video-based emotion tracking for dynamic recommendations. </p>
CODE LICENSE

<p> <pre> MIT License
Copyright (c) 2024 Emotionfy Team

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. </pre>

</p>
