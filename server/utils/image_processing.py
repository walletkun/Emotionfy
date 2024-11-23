import cv2
import numpy as np
from typing import Union, Tuple, Optional

class ImageProcessor:
    @staticmethod
    def decode_image(image_data: Union[str, bytes, np.ndarray]) -> Optional[np.ndarray]:
        """Decode image from various formats to cv2 format"""
        try:
            if isinstance(image_data, str):  # File path
                return cv2.imread(image_data)
            elif isinstance(image_data, bytes):  # Bytes data from request
                nparr = np.frombuffer(image_data, np.uint8)
                return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            elif isinstance(image_data, np.ndarray):  # Already a cv2 image
                return image_data
            return None
        except Exception as e:
            print(f"Error decoding image: {str(e)}")
            return None

    @staticmethod
    def preprocess_image(image: np.ndarray, target_size: Tuple[int, int] = (48, 48)) -> Optional[np.ndarray]:
        """Preprocess image for model input"""
        try:
            # Resize image
            resized = cv2.resize(image, target_size)
            
            # Convert to grayscale if needed
            if len(resized.shape) == 3:
                resized = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
            
            # Normalize
            normalized = resized.astype('float32') / 255.0
            
            # Reshape for model input
            processed = normalized.reshape(1, target_size[0], target_size[1], 1)
            
            return processed
        except Exception as e:
            print(f"Error preprocessing image: {str(e)}")
            return None