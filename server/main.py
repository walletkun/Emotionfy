import os
import sys

# Add the parent directory to Python path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

from server import create_app

def main():
    app = create_app()
    app.run(debug=True, port=5000)

if __name__ == '__main__':
    main()