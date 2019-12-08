
#include <ESP8266WiFi.h> // Enables the ESP8266 to connect to the local network (via WiFi)
#include <PubSubClient.h> // Allows us to connect to, and publish to the MQTT broker
#include <ArduinoJson.h>
// interrupt var
bool restStatus = 0;
bool kitFanStatus = 0;
bool restButtonError = 0;
bool kitFanButtonError = 0;
unsigned long pirPreviousTime = 0;
const long pirBrightTime = 4000;
bool interruptIsHappened = 0;
// WiFi
// Make sure to update this for your own WiFi network!
const char* ssid = "CHILINH";
const char* wifi_password = "chilinh123";

// MQTT
// Make sure to update this for your own MQTT Broker!
const char* mqtt_server = "192.168.43.200";
const char* mqtt_topic_fan = "smarthome/fan/controll";
const char* mqtt_fan_reply_topic = "smarthome/fan/feedback";
const char* mqtt_topic_restroom_light = "smarthome/light/restroom";
const char* mqtt_light_reply_topic = "smarthome/light/feedback";
const char* mqtt_topic_interrupt_pir = "smarthome/pir/interrupt";
//const char* mqtt_topic_attach_pir = "smarthome/pir/attach";

const char* mqtt_username = "chilinh";
const char* mqtt_password = "chilinh123";
// The client id identifies the ESP8266 device. Think of it a bit like a hostname (Or just a name, like Greg).
const char* clientID = "ESP8266_PIR";

// Initialise the WiFi and MQTT Client objects
WiFiClient wifiClient;
PubSubClient client(mqtt_server, 1883, wifiClient); // 1883 is the listener port for the Broker

void ReceivedMessage(char* topic, byte* payload, unsigned int length) {
  // Output the first character of the message to serial (debug)
  char command[length+1];
  for (unsigned int i = 0; i < length; i++) {
    command[i] = (char)(payload[i]);
  }
  command[length]='\0';
  Serial.println(command);
  controll(topic,command);
}
  

bool Connect() {
  // Connect to MQTT Server and subscribe to the topic
  if (client.connect(clientID, mqtt_username, mqtt_password)) {
      //client.subscribe(mqtt_topic);
      client.subscribe(mqtt_topic_fan);
      client.subscribe(mqtt_topic_restroom_light);
      client.subscribe(mqtt_topic_interrupt_pir);
      //client.subscribe(mqtt_topic_bedroom_light);
      //client.subscribe(mqtt_topic_kitchen_light);
      return true;
    }
    else {
      return false;
  }
}
void restPir(void) {
  Serial.println("Pir yyy");
  digitalWrite(13, HIGH);
  restStatus = 1;
  pirPreviousTime = millis();
  interruptIsHappened = 1;
}
void fanButton(void) {
  Serial.println("fanButtonPressed");
  if ( kitFanButtonError == 0 ) {
    kitFanButtonError = 1;
    kitFanStatus = digitalRead(12);
    if (kitFanStatus) {
      digitalWrite(12, LOW);
      kitFanStatus = 0;
    } else {
      digitalWrite(12, HIGH);
      kitFanStatus = 1;
    }
  } else kitFanButtonError = 0;
}
void restButton(void) {
    Serial.println("restButtonPressed");
    if ( !restButtonError ) {
      restButtonError = 1;
      restStatus = digitalRead(13);
      if (restStatus) {
          restStatus = 0;
          Serial.println("LOWPressed");
          digitalWrite(13, LOW);
      } else {
          restStatus = 1;
          Serial.println("HIGHPressed");
          digitalWrite(13, HIGH);
          
    }
   } else restButtonError = 0;
}
void setup(){
  pinMode(12, OUTPUT); //fan kitchen - D6
  digitalWrite(12, LOW);
  pinMode(13, OUTPUT); //restroom light - D7
  digitalWrite(13, LOW);
  attachInterrupt(4, fanButton, RISING); //fan button - D2
  attachInterrupt(14, restButton, RISING); //restroom button - D5
  pinMode(5, INPUT);
  attachInterrupt(5, restPir, RISING); // PIR restroom
  Serial.begin(115200);
  Serial.print("Connecting to ");
  Serial.println(ssid);

  // Connect to the WiFi
  WiFi.begin(ssid, wifi_password);

  // Wait until the connection has been confirmed before continuing
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print("...");
  }

  // Debugging - Output the IP Address of the ESP8266
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Connect to MQTT Broker
  // setCallback sets the function to be called when a message is received.
  client.setCallback(ReceivedMessage);
  if (Connect()) {
    Serial.println("Connected Successfully to MQTT Broker!");  
  }
  else {
    Serial.println("Connection Failed!");
  }
}
void loop() {
  if (interruptIsHappened) {
      unsigned long pirCurrentTime = millis();
      if ( (pirCurrentTime - pirPreviousTime) >= pirBrightTime){
          bool pirPinValue = digitalRead(5); // Read the value of PIN 5 connecting to PIR sensor.
          if (!pirPinValue) {
            digitalWrite(13, LOW);
            restStatus = 0;
            interruptIsHappened = 0;
          }
      }
  }

  //dht_collect();
  // If the connection is lost, try to connect again
  if (!client.connected()) {
    Connect();
  }
  // client.loop() just tells the MQTT client code to do what it needs to do itself (i.e. check for messages, etc.)
  client.loop();
  // Once it has done all it needs to do for this cycle, go back to checking if we are still connected.
}
void controll(char* topic, char* command) {
  if (!strcmp(topic, mqtt_topic_restroom_light)) {
    char* lightstatus;
    if (!strcmp(command,"on")) {
      digitalWrite(13, HIGH);
      Serial.println("restroom on");
      lightstatus = "on";
      restStatus = 1;
    }
    if (!strcmp(command,"off")) {
      digitalWrite(13, LOW);
      Serial.println("restroom off");
      lightstatus = "off";
      restStatus = 0;
    }
    feedback("restroomlight", lightstatus);
  }
//  if (!strcmp(topic,mqtt_topic_bedroom_light)) {
//    char* lightstatus;
//     if (!strcmp(command,"on")) {
//      digitalWrite(13, HIGH);
//      Serial.println("bedroom_light on");
//      lightstatus = "on";
//    }
//    if (!strcmp(command,"off")) {
//      digitalWrite(13, LOW);
//      Serial.println("bedroom_light off");
//      lightstatus = "off";
//    }
//    feedback("bedroomlight", lightstatus);
//  }
//  if (!strcmp(topic,mqtt_topic_kitchen_light)) {
//    char* lightstatus;
//     if (!strcmp(command,"on")) {
//      digitalWrite(12, HIGH);
//      Serial.println("kitchen_light on");
//      lightstatus = "on";
//      kitStatus = 1;
//    }
//    if (!strcmp(command,"off")) {
//      digitalWrite(12, LOW);
//      Serial.println("kitchen_light off");
//      lightstatus = "off";
//      kitStatus = 0;
//    }
//    feedback("kitchenlight", lightstatus);
//  }
  if (!strcmp(topic,mqtt_topic_fan)) {
    char* fanstatus;
     if (!strcmp(command,"on")) {
      digitalWrite(12, HIGH);
      Serial.println("fan on");
      fanstatus = "on";
      kitFanStatus = 1;
    }
    if (!strcmp(command,"off")) {
      digitalWrite(12, LOW);
      Serial.println("fan off");
      fanstatus = "off";
      kitFanStatus = 0;
    }
    fan_feedback("fan", fanstatus);
  }
  if(!strcmp(topic, mqtt_topic_interrupt_pir)){
    if (!strcmp(command, "attach")){
      attachInterrupt(5, restPir, RISING);
    } else if (!strcmp(command, "detach")) {
      detachInterrupt(digitalPinToInterrupt(5));
    }
  }
}
void feedback(char* light, char* lightstatus) {
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();

  JsonObject& feedback = root.createNestedObject("feedback");
  feedback["light"] = light;
  feedback["status"] = lightstatus;
  char char_reply[60];
  root.printTo(char_reply);
  Serial.println(char_reply);
  if (client.publish(mqtt_light_reply_topic, char_reply))
       Serial.println("Replied to MQTT server");
  else {
       Serial.println("Failed to reply.Reconnecting to MQTT server");
        Connect();
        client.publish(mqtt_light_reply_topic, char_reply);
  }
}
void fan_feedback(char* fan, char* fanstatus) {
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();

  JsonObject& feedback = root.createNestedObject("feedback");
  feedback["fan"] = fan;
  feedback["status"] = fanstatus;
  char char_reply[60];
  root.printTo(char_reply);
  Serial.println(char_reply);
  if (client.publish(mqtt_fan_reply_topic, char_reply))
       Serial.println("Replied to MQTT server");
  else {
       Serial.println("Failed to reply.Reconnecting to MQTT server");
        Connect();
        client.publish(mqtt_fan_reply_topic, char_reply);
  }
}
