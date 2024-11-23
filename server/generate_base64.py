import base64
import requests

# Replace these with your actual file paths and API endpoint
image_file = "/Users/lucasyao/Documents/GitHub/faceify/faceify/public/cray.jpg"
api_url = "http://127.0.0.1:5000/api/emotion/analyze"

# Read the image and encode it in base64
with open(image_file, "rb") as img:
    base64_string = base64.b64encode(img.read()).decode("utf-8")

# Construct the JSON payload
payload = {"image": f"data:image/jpeg;base64,{base64_string}"}

# Send the request
response = requests.post(api_url, json=payload)

# Print the response
print("Response:", response.json())
print("Payload:", payload)

