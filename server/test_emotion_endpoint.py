import os
import requests
import base64
import cv2
import numpy as np
import time

def check_server():
    """Check if server is running"""
    try:
        response = requests.get('http://localhost:5000/health')
        print(f"Server health check response: {response.text}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        return False

def wait_for_server(timeout=30):
    """Wait for server to start"""
    print("Waiting for server to start...")
    start_time = time.time()
    while time.time() - start_time < timeout:
        if check_server():
            print("Server is running!")
            return True
        time.sleep(1)
        print(".", end="", flush=True)
    print("\nServer not responding after timeout")
    return False

def test_upload_endpoint():
    """Test the image upload endpoint"""
    test_image_path = r"C:\Users\72411\Desktop\final_project_CTP\faceify\server\models\data\test_image_happy.jpg"
    
    # Verify image exists
    if not os.path.exists(test_image_path):
        print(f"Error: Test image not found at {test_image_path}")
        return False
    
    url = "http://localhost:5000/api/emotion/analyze"
    
    try:
        with open(test_image_path, 'rb') as img:
            files = {'image': ('test.jpg', img, 'image/jpeg')}
            print(f"Sending request to {url}")
            response = requests.post(url, files=files)
            
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Headers: {response.headers}")
        print(f"Raw Response: {response.text}")
        
        try:
            json_response = response.json()
            print("JSON Response:", json_response)
            return response.status_code == 200
        except requests.exceptions.JSONDecodeError:
            print("Error: Response is not valid JSON")
            return False
            
    except Exception as e:
        print(f"Error during upload test: {str(e)}")
        return False

def print_file_info(file_path):
    """Print information about a file"""
    try:
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            print(f"File exists at {file_path}")
            print(f"File size: {size} bytes")
            if size == 0:
                print("Warning: File is empty")
        else:
            print(f"File does not exist at {file_path}")
    except Exception as e:
        print(f"Error checking file: {str(e)}")

if __name__ == "__main__":
    # Check if server is running
    if not wait_for_server():
        print("Please start the server first using 'python main.py'")
        exit(1)
    
    # Print information about test image
    test_image_path = r"C:\Users\72411\Desktop\final_project_CTP\faceify\server\models\data\test_image_happy.jpg"
    print("\nChecking test image...")
    print_file_info(test_image_path)
    
    print("\nTesting upload endpoint...")
    upload_success = test_upload_endpoint()
    print("Upload test:", "Success" if upload_success else "Failed")