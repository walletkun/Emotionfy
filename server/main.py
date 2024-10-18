from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
#Change the origins to the domain you want to allow later on for now we are allowing all
cors = CORS(app, origins='*')

@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify({
        'users': [
            'Fei',
            'Lucas',
            'Rey']})
    


if __name__ == '__main__':
    app.run(port=8000, debug=True)