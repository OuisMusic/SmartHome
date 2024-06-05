from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Device(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    device_type = db.Column(db.String(80), nullable=False)
    status = db.Column(db.Boolean, default=False)
    location = db.Column(db.String(100))

    def __repr__(self):
        return f'<Device {self.name}>'

class Scene(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    actions = db.relationship('Action', backref='scene', lazy='dynamic')

    def __repr__(self):
        return f'<Scene {self.name}>'

class Action(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.Integer, db.ForeignKey('device.id'), nullable=False)
    scene_id = db.Column(db.Integer, db.ForeignKey('scene.id'), nullable=False)
    action = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'<Action {self.action} on {self.device_id}>'

if __name__ == '__main__':
    with app.app_context():
        db.create_all()