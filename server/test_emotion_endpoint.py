import os
import requests
import base64
import cv2
import numpy as np
import time

def check_server():
    """Check if server is running"""
    try:
        response = requests.get('http://127.0.0.1:5000/health', timeout=5)
        print(f"Server health check response: {response.text}")
        print(f"Response status code: {response.status_code}")  # Add this line
        print(f"Response headers: {dict(response.headers)}")    
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        return False

def wait_for_server(timeout=5):
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
    test_image_path = "/Users/ceo/Desktop/CTP_DATASCI_FRIDAY/final_new_project/faceify/server/models/data/test_happy.jpeg"
    url = "http://127.0.0.1:5001/api/emotion/analyze"
    
    try:
        print(f"Opening file: {test_image_path}")
        with open(test_image_path, 'rb') as img:
            files = {'image': ('test_happy.jpeg', img, 'image/jpeg')}
            headers = {
                'Accept': 'application/json',
                'User-Agent': 'python-requests/2.31.0'  # Match a standard user agent
            }
            
            response = requests.post(
                url, 
                files=files,
                headers=headers,
                timeout=30
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Headers: {dict(response.headers)}")
            print(f"Response: {response.text}")
            
            return response.status_code == 200
    except Exception as e:
        print(f"Error: {str(e)}")
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
    test_image_path = "/Users/ceo/Desktop/CTP_DATASCI_FRIDAY/final_new_project/faceify/server/models/data/test_happy.jpeg"
    print("\nChecking test image...")
    print_file_info(test_image_path)
    
    print("\nTesting upload endpoint...")
    upload_success = test_upload_endpoint()
    print("Upload test:", "Success" if upload_success else "Failed")