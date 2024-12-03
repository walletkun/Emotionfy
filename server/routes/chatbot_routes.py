import os
from flask import Blueprint, request, jsonify
import openai
import logging

chatbot_bp = Blueprint('chatbot', __name__)

# Load OpenAI API key from environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")

@chatbot_bp.route('/chat', methods=['POST'])
def chat_with_bot():
    try:
        # Log the request payload
        data = request.json
        logging.info(f"Received request data: {data}")

        # Extract the user's query and mood
        user_query = data.get('query')
        mood = data.get('mood', 'neutral')  # Default mood if not provided

        # Ensure query is provided
        if not user_query:
            logging.error("No query provided in the request")
            return jsonify({'error': 'No query provided'}), 400

        # Construct the prompt for the LLM
        messages = [
            {"role": "system", "content": "You are an AI assistant that suggests songs based on mood and responds to user queries."},
            {"role": "user", "content": f"The user's mood is '{mood}'. The user asked: {user_query}"}
        ]

        # Log the constructed messages
        logging.info(f"Messages for OpenAI: {messages}")

        # Generate a response using OpenAI's ChatGPT model
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Or "gpt-4" if you have access
            messages=messages,
            max_tokens=200,
            temperature=0.7
        )

        # Extract the chatbot's response
        chatbot_response = response['choices'][0]['message']['content'].strip()
        logging.info(f"Chatbot response: {chatbot_response}")

        return jsonify({'response': chatbot_response})

    except openai.AuthenticationError:
        logging.error("OpenAI Authentication Error: Check your API key")
        return jsonify({'error': 'OpenAI authentication failed. Check your API key.'}), 401
    except openai.BadRequestError as e:
        logging.error(f"Bad Request Error: {e}")
        return jsonify({'error': 'Invalid request sent to OpenAI API.'}), 400
    except openai.RateLimitError:
        logging.error("Rate limit exceeded on OpenAI API")
        return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429
    except openai.APIConnectionError:
        logging.error("API Connection Error: Could not reach OpenAI API")
        return jsonify({'error': 'Failed to connect to OpenAI API. Check your internet connection.'}), 503
    except openai.OpenAIError as e:
        logging.error(f"General OpenAI API Error: {e}")
        return jsonify({'error': 'An error occurred while interacting with OpenAI API.'}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({'error': 'Something went wrong while processing your request.'}), 500
