import os
import sys
from dotenv import load_dotenv

load_dotenv()

# Add the parent directory to Python path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
print(parent_dir)
sys.path.append(parent_dir)

from server import create_app

def main():
    app = create_app()
    app.run(debug=True,host='127.0.0.1',port=5001, threaded=True, use_reloader=False)

if __name__ == '__main__':
    main()
