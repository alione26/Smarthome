import json
import requests

def send2database(topic, jsondata):
    if topic == "smarthome/dht22" :
        sensorData = jsondata['DHT']
        print(sensorData)
        senddata = json.dumps(sensorData)
        API_ENDPOINT = "http://192.168.1.6:3000/smarthome_device/update-data/b6995ae2-8ec6-4747-ab4d-e3ca4bb0ffd0"
        data = {
            "data" : senddata
        }
        r = requests.post(url = API_ENDPOINT, data = data)
        pastebin_url = r.text 
        print("The pastebin URL is:%s"%pastebin_url)
    if topic == "smarthome/fingerprint/feedback" :
        fingerdata = jsondata['finger']
        print(fingerdata)
        if fingerdata['enroll'] == "enrolled" :
            finger_id = fingerdata['id']
            API_FINGER_ENDPOINT = "http://192.168.1.6:3000/smarthome_user/update-fingerId/889306ea-2fc3-4ab1-a9d5-5706ccdd9fd0"
            data = {
                "finger_id" : finger_id
                }
            r = requests.post(url = API_FINGER_ENDPOINT, data = data)
            pastebin_url = r.text 
            print("The pastebin URL is:%s"%pastebin_url)
        if fingerdata['delete'] == "deleted" :
            finger_id = ""
            API_FINGER_ENDPOINT = "http://192.168.1.6:3000/smarthome_user/update-fingerId/889306ea-2fc3-4ab1-a9d5-5706ccdd9fd0"
            data = {
                "finger_id" : finger_id
                }
            r = requests.post(url = API_FINGER_ENDPOINT, data = data)
            pastebin_url = r.text 
            print("The pastebin URL is:%s"%pastebin_url)
            
        
            



        
