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

MQTT_Topic_Finger_Subscribe = "smarthome/fingerprint/feedback"
MQTT_Topic_Light_Subscribe = "smarthome/light/feedback"
MQTT_Topic_DHT22_Subscribe = "smarthome/dht22"
MQTT_Topic_Fan_Subscribe = "smarthome/fan/feedback"


#====================================================

def on_connect(client, userdata, flags, rc):
        if rc != 0:
                print("Cannot connect to Broker : ",rc)
                
        else:
                print("Connected to :", MQTT_Broker)
                mqttc.subscribe(MQTT_Topic_Finger_Subscribe)
                mqttc.subscribe(MQTT_Topic_Light_Subscribe)
                mqttc.subscribe(MQTT_Topic_DHT22_Subscribe)
                mqttc.subscribe(MQTT_Topic_Fan_Subscribe)
                
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
    jsonData = msg.payload
    json_Dict = json.loads(jsonData.decode('utf-8'))
    print(json_Dict)
    send2database(msg.topic, json_Dict)

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
    
