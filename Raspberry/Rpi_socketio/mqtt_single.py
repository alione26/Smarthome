import paho.mqtt.publish as publish
import json

MQTT_Topic_Finger_Publish = "smarthome/fingerprint/command"
MQTT_Topic_LivingroomLight_Publish = "smarthome/light/livingroom"
MQTT_Topic_BedroomLight_Publish = "smarthome/light/bedroom"
MQTT_Topic_KitchenLight_Publish = "smarthome/light/kitchen"
MQTT_Topic_Fan_Publish = "smarthome/fan/controll"

fingersensorId = "f3a84ca2-3fef-4e8e-b4d8-03ce82bab4da"
livingroomlightId = "f9a5ea77-6013-4fc3-b6cb-26272f3e9cdc"
bedroomlightId = "45b0574d-d4c0-449f-8a4c-e2d3fa4786d1"
kitchenlightId = "224f4300-0eed-42a9-bf4b-93947076c4df"
fanId = "3a8f0cca-5572-4622-b4cd-376b8abcb7ed"

def publish_msg(topic, command) :
    publish.single(topic, command, hostname="192.168.1.200", port = 1883, 
    auth={'username': 'chilinh', 'password': 'chilinh123'})

def getaction(jsonData) :
    json_Dict = json.loads(jsonData)
    print(json_Dict)
    deviceId = json_Dict['deviceId']
    action = json_Dict['action']
    data = json_Dict['data']


    if deviceId == fingersensorId :
        fingerprint_command = {}
        fingerprint_command['Function'] = action
        if fingerprint_command['Function'] == 'delete' :
            print(data['finger_id'])
            fingerprint_command['Delete_id'] = data['finger_id']
        json_command = json.dumps(fingerprint_command)
        publish_msg(MQTT_Topic_Finger_Publish, json_command)

    if deviceId == livingroomlightId :
        publish_msg(MQTT_Topic_LivingroomLight_Publish, action)

    if deviceId == bedroomlightId :
        publish_msg(MQTT_Topic_BedroomLight_Publish, action)

    if deviceId == kitchenlightId :
        publish_msg(MQTT_Topic_KitchenLight_Publish, action)

    if deviceId == fanId :
        publish_msg(MQTT_Topic_Fan_Publish, action)
