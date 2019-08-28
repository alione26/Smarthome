import socketio
import json
from mqtt_single import getaction

# standard Python
sio = socketio.Client()

@sio.on('connect')
def on_connect():
    print('I\'m connected!')
    sio.emit('smarthomeId', "de782a97-bc34-4e39-a005-10973e92b54e")
@sio.on('hey')
def on_message(data):
    jsonData = json.dumps(data)
    getaction(jsonData)

@sio.on('disconnect')
def on_disconnect():
    print('I\'m disconnected!')

sio.connect('http://192.168.1.6:3000')
