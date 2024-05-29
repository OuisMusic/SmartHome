from flask import Flask
import os
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.environ.get('SECRET_KEY', 'your_secret_key')
DEBUG = os.environ.get('DEBUG', 'True') == 'True'
HOST = os.environ.get('HOST', '0.0.0.0')
PORT = int(os.environ.get('PORT', 5000))

app = Flask(__name__)

app.config['SECRET_KEY'] = SECRET_KEY
app.config['DEBUG'] = DEBUG

from routes import *

if __name__ == '__main__':
    app.run(host=HOST, port=PORT, debug=DEBUG)