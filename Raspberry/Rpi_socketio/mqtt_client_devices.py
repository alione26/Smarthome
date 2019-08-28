import json
import paho.mqtt.client as mqtt
#from buffer import forward2mqqtt
from send2database import send2database

#====================================================
# MQTT Settings 
MQTT_Broker = "192.168.1.200"
MQTT_Port = 1883
mqtt_username = "chilinh"
mqtt_password = "chilinh123"
Keep_Alive_Interval = 45

MQTT_Topic_Finger_Publish = "smarthome/fingerprint/command"
MQTT_Topic_LivingroomLight_Publish = "smarthome/light/livingroom"
MQTT_Topic_BedroomLight_Publish = "smarthome/light/bedroom"
MQTT_Topic_KitchenLight_Publish = "smarthome/light/kitchen"
MQTT_Topic_Fan_Publish = "smarthome/fan/controll"


#====================================================

def on_connect(client, userdata, flags, rc):
        if rc != 0:
                print("Cannot connect to Broker : ",rc)
                
        else:
                print("Connected to :", MQTT_Broker)
                mqttc.subscribe(MQTT_Topic_Finger_Publish)
                mqttc.subscribe(MQTT_Topic_LivingroomLight_Publish)
                mqttc.subscribe(MQTT_Topic_BedroomLight_Publish)
                mqttc.subscribe(MQTT_Topic_KitchenLight_Publish)
                mqttc.subscribe(MQTT_Topic_Fan_Publish)
                
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

def on_publish(client, userdata, mid):
        pass
		
def on_disconnect(client, userdata, rc):
	if rc !=0:
		pass
		
mqttc = mqtt.Client()
mqttc.on_message = on_message
mqttc.on_connect = on_connect
mqttc.on_disconnect = on_disconnect
mqttc.on_publish = on_publish
mqttc.username_pw_set(mqtt_username, mqtt_password)
mqttc.connect(MQTT_Broker, int(MQTT_Port), int(Keep_Alive_Interval))
mqttc.loop_forever()
#====================================================


#====================================================

mqttc.loop_forever()
    
