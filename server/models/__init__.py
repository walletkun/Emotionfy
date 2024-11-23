import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Dense, Flatten, Dropout, Input
from tensorflow.keras.optimizers import Adam
import os

print(f"TensorFlow version: {tf.__version__}")

def create_emotion_model():
    inputs = Input(shape=(48, 48, 1))
    model = Sequential([
        inputs,
        Conv2D(64, (3, 3), padding="same", activation='relu'),
        Conv2D(64, (3, 3), padding="same", activation='relu'),
        MaxPooling2D((2, 2)),
        
        Conv2D(128, (3, 3), padding="same", activation='relu'),
        Conv2D(128, (3, 3), padding="same", activation='relu'),
        MaxPooling2D((2, 2)),
        
        Conv2D(256, (3, 3), padding="same", activation='relu'),
        Conv2D(256, (3, 3), padding="same", activation='relu'),
        MaxPooling2D((2, 2)),
        
        Conv2D(512, (3, 3), padding="same", activation='relu'),
        Conv2D(512, (3, 3), padding="same", activation='relu'),
        Conv2D(512, (3, 3), padding="same", activation='relu'),
        MaxPooling2D((2, 2)),
        
        Conv2D(512, (3, 3), padding="same", activation='relu'),
        Conv2D(512, (3, 3), padding="same", activation='relu'),
        Conv2D(512, (3, 3), padding="same", activation='relu'),
        MaxPooling2D((2, 2)),
        
        Flatten(),
        Dense(4096, activation='relu'),
        Dropout(0.5),
        Dense(4096, activation='relu'),
        Dense(7, activation='softmax')
    ])
    
    model.compile(
        optimizer=Adam(learning_rate=0.0001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

try:
    # Create new model
    model = create_emotion_model()
    print("Model created successfully")
    
    # Get the path
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    old_model_path = os.path.join(project_root, 'models', 'emotion_model.keras')
    
    # Try to load and transfer weights manually
    old_model = tf.keras.models.load_model(old_model_path, compile=False)
    weights = old_model.get_weights()
    model.set_weights(weights)
    print("Weights transferred successfully")
    
    # Save in h5 format
    save_path = os.path.join(project_root, 'models', 'emotion_model.h5')
    model.save(save_path, save_format='h5')
    print(f"Model saved to {save_path}")

except Exception as e:
    print(f"Error: {str(e)}")