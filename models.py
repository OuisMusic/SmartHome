from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///smarthome.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class SmartDevice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    device_type = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean, default=False)
    location = db.Column(db.String(100))

    def __repr__(self):
        return f'<SmartDevice {self.name} - Type {self.device_type}>'

class AutomationScene(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    scene_actions = db.relationship('AutomationAction', backref='scene', lazy='dynamic')

    def __repr__(self):
        return f'<AutomationScene {self.name}>'

class AutomationAction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.Integer, db.ForeignKey('smart_device.id'), nullable=False)
    scene_id = db.Column(db.Integer, db.ForeignKey('automation_scene.id'), nullable=False)
    specified_action = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'<AutomationAction {self.specified_action} for Device ID {self.device_id}>'

if __name__ == '__main__':
    with app.app_context():
        db.create_all()