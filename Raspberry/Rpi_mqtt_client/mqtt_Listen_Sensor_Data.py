import paho.mqtt.client as mqtt
from store_Sensor_Data_to_DB import sensor_Data_Handler

#====================================================
# MQTT Settings 
MQTT_Broker = "192.168.1.200"
MQTT_Port = 1883
mqtt_username = "chilinh"
mqtt_password = "chilinh123"
Keep_Alive_Interval = 45
MQTT_Topic = "Home/BedRoom/#"

#====================================================


def on_connect(client, userdata, flags, rc):
        if rc != 0:
                print("Cannot connect to Broker : ",rc)
                
        else:
                print("Connected to :", MQTT_Broker)
                mqttc.subscribe(MQTT_Topic, 0)
                
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
    sensor_Data_Handler(msg.topic, msg.payload)

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
