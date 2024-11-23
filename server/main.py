import os
import sys

# Add the parent directory to the Python path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print(f"Parent directory: {parent_dir}")
sys.path.append(parent_dir)

# Now import the necessary components from the app
from server import create_app
from server.routes.spotify_routes import spotify_bp  # Make sure this path is correct

def main():
    app = create_app()
    app.run(debug=True, host='127.0.0.1', port=5001, use_reloader=False)

if __name__ == '__main__':
    main()
