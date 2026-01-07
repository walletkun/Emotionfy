# 🎵 Emotionfy

## Emotion-Driven Playlist Recommendation System

**Emotionfy** is a cutting-edge system that merges the power of emotion detection with personalized music recommendations. Using deep learning for facial emotion recognition and Spotify’s API, this application recommends playlists tailored to the user’s emotional state. Upload an image, and **Emotionfy** will do the rest — analyzing your emotion and curating a playlist to match your mood.

---

## 👥 Team Members
- **Rey Reyes**: CNN Researcher 
- **Lucas Yao**: Backend Developer, Frontend Support  
- **Fei Lin**: Project Lead, Backend Developer

---

## 📂 Datasets Used

1. [Emotion Detection FER Dataset](https://www.kaggle.com/datasets/ananthu017/emotion-detection-fer)  
   35,887 grayscale 48x48 pixel images labeled with: Angry, Disgust, Fear, Happy, Neutral, Sad, Surprise

2. [Face Expression Recognition Dataset](https://www.kaggle.com/datasets/jonathanoheix/face-expression-recognition-dataset)  
   A complementary dataset designed for facial emotion recognition tasks.

---

## 🎯 Goal

To enhance emotion detection by integrating Spotify's API, **Emotionfy** recommends playlists based on user emotions. The deep learning model analyzes facial expressions and maps them to Spotify playlists, offering a seamless blend of technology and music personalization.

---

## 🧠 Model Architecture

- **Base Model**: Trained a CNN on the FER Kaggle dataset for emotion classification  
- **Emotion-to-Playlist Mapping**: Custom layer to map emotions to Spotify playlists

---

## 🛠 Tech Stack

### Frontend
- [React](https://react.dev/): Interactive UI

### Backend
- [Flask](https://flask.palletsprojects.com/): API and emotion detection  
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/): Playlist generation

### Data Processing
- Data augmentation and preprocessing for model generalization

### Libraries and Tools
- [TensorFlow](https://www.tensorflow.org/), [Keras](https://keras.io/): Deep learning  
- [OpenCV](https://opencv.org/): Image processing  
- [Pandas](https://pandas.pydata.org/), [NumPy](https://numpy.org/): Data handling  
- [Matplotlib](https://matplotlib.org/), [Seaborn](https://seaborn.pydata.org/): Data visualization  
- [Jupyter Notebook](https://jupyter.org/): Development and experiments

### Integration
- [Spotify OAuth 2.0](https://developer.spotify.com/documentation/general/guides/authorization-guide/): Secure authentication  
- Spotify Web Playback SDK: Music playback integration

---

## ✨ Features

1. **Emotion Detection**  
   - Analyze facial expressions in images or real-time video  
   - Detect emotions such as Happy, Sad, Angry, etc.

2. **Playlist Recommendation**  
   - Fetch Spotify playlists based on detected emotion  
   - In-app music playback

3. **User Interface**  
   - Upload image or stream video  
   - Display detected emotion with personalized playlist

---

## 📈 Evaluation Metrics

- **Emotion Detection**: Accuracy, Precision, Recall, F1-score  
- **Playlist Recommendation**: Relevance and alignment (user feedback)

---

## ⚙️ Setup Instructions

### Requirements

- Python 3.8+  
- Spotify Developer Account

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/emotionfy.git
   cd server
   ```
2. **Installing dependencies**
  ```bash
   pip install -r requirements.txt
   ```
3. **Configure Spotify API**
  - Create a Spotify Developer Account
  - Set up an app and get the Client ID and Client Secret
  - Update config.py with your credentials
4. **Run the application**
    ```bash
    npm run dev
    ```
5. **Run the backend server**
  ```bash
  python3 main.py
  ```

# 🚀 Future Ingeration
- User Customization: Link personal Spotify accounts
- Platform Expansion: Support Apple Music and others
- Improved Emotion Detection: Add video-based tracking

# 📜 License
```txt
MIT License

Copyright (c) 2024 Emotionfy Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...

THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND...
```

