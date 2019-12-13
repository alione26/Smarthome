#include <ESP8266WiFi.h> // Enables the ESP8266 to connect to the local network (via WiFi)
#include <PubSubClient.h> // Allows us to connect to, and publish to the MQTT broker
#include <ArduinoJson.h>
#include "hw_timer.h" 
//dht22 config    
#include "DHT.h"
#define DHTPIN 2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE); 
//    
const byte zcPin = 12;
const byte pwmPin = 13;  

byte fade = 1;
byte state = 1;
byte tarBrightness = 255;
byte curBrightness = 0;
byte zcState = 0; // 0 = ready; 1 = processing;
//variable for button
bool bedButtonError = 0;
bool lampButtonError = 0;
bool bedStatus = 0;
bool lampStatus = 0;
// WiFi
// Make sure to update this for your own WiFi network!
const char* ssid = "BKSMARTHOME";
const char* wifi_password = "chilinh123";
// MQTT
// Make sure to update this for your own MQTT Broker!
const char* mqtt_server = "192.168.0.200";
const char* mqtt_topic_bedroom_dht22 = "smarthome/dht22/bedroom";
const char* mqtt_topic_lamp_light = "smarthome/light/lamp";
const char* mqtt_topic_bedroom_light = "smarthome/light/bedroom";
const char* mqtt_light_reply_topic = "smarthome/light/feedback";
//MQTT Authentication
const char* mqtt_username = "chilinh";
const char* mqtt_password = "chilinh123";
// The client id identifies the ESP8266 device. Think of it a bit like a hostname (Or just a name, like Greg).
const char* clientID = "ESP8266_LAMP";
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
      client.subscribe(mqtt_topic_lamp_light);
      client.subscribe(mqtt_topic_bedroom_light);
      return true;
    }
    else {
      return false;
  }
}
void lampButton(void) {
  Serial.println("button-lamp");
  if ( lampButtonError == 0 ) {
    lampButtonError =1;
    if ( lampStatus ) {
      lampStatus = 0;
      digitalWrite(5, LOW);
      Serial.println("lamp off");
    } else {
      lampStatus = 1;
      digitalWrite(5, HIGH);
      Serial.println("lamp on");
    }
  }else lampButtonError = 0;
}
void bedButton(void) {
  Serial.println("button-bed");
  if ( bedButtonError == 0 ) {
    bedButtonError =1;
    if ( bedStatus ) {
      bedStatus = 0;
      digitalWrite(15, LOW);
      Serial.println("bedroom light off");
    } else {
      bedStatus = 1;
      digitalWrite(15, HIGH);
      Serial.println("bedroom light on");
    }
  }else bedButtonError = 0;
}

void setup() {
  Serial.begin(115200);   
  pinMode(zcPin, INPUT_PULLUP);
  pinMode(pwmPin, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(15,OUTPUT);
  attachInterrupt(zcPin, zcDetectISR, RISING);    // Attach an Interupt to Pin 2 (interupt 0) for Zero Cross Detection
  attachInterrupt(4, lampButton, RISING);
  attachInterrupt(14, bedButton, RISING);
  // dth22 begin
  dht.begin();
  //
  hw_timer_init(NMI_SOURCE, 0);
  hw_timer_set_func(dimTimerISR);
  //WIFI connetc establish
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
  // put your main code here, to run repeatedly:
//    if (Serial.available()){
//        int val = Serial.parseInt();
//        if (val>0){
//          tarBrightness =val;
//          Serial.println(tarBrightness);
//        }
//        
//    }
  dht_collect();
    // If the connection is lost, try to connect again
  if (!client.connected()) {
    Connect();
  }
  // client.loop() just tells the MQTT client code to do what it needs to do itself (i.e. check for messages, etc.)
  client.loop();
  // Once it has done all it needs to do for this cycle, go back to checking if we are still connected.
}

void controll(char* topic, char* command) {
  if (!strcmp(topic,mqtt_topic_lamp_light)) {
    char* lightstatus;
    //int val = command.parseInt();
    if(!strcmp(command, "on")) {
       digitalWrite(5, HIGH);
        Serial.println("lamp_light on");
        lampStatus = 1;
        lightstatus = "on";
    }
    else if (!strcmp(command, "off")){
        digitalWrite(5, LOW);
        Serial.println("lamp_light off");
        lampStatus = 0;
        lightstatus = "off";
    }
    else if (!strcmp(command, "100")) {
          tarBrightness = 255;
          Serial.println(tarBrightness);
          lightstatus = "100";
          
    }
    else if (!strcmp(command, "75")) {
      tarBrightness = 165;
      Serial.println(tarBrightness);
      lightstatus = "75";
    }
    else if (!strcmp(command, "50")) {
      tarBrightness = 100;
      Serial.println(tarBrightness);
      lightstatus = "50";
    }
    else if (!strcmp(command, "25")) {
      tarBrightness = 70;
      Serial.println(tarBrightness);
      lightstatus = "25";
    }
    feedback("lamplight", lightstatus);
}
  if (!strcmp(topic,mqtt_topic_bedroom_light)) {
     char* lightstatus;
     if (!strcmp(command,"on")) {
          digitalWrite(15, HIGH);
          Serial.println("bedroom_light on");
          bedStatus = 1;
          lightstatus = "on";
    }
     if (!strcmp(command,"off")) {
        digitalWrite(15, LOW);
        Serial.println("bedroom_light off");
        bedStatus = 0;
        lightstatus = "off";
    }
    feedback("bedroomlight", lightstatus);
  }
}


void dimTimerISR() {
    if (fade == 1) {
      if (curBrightness > tarBrightness || (state == 0 && curBrightness > 0)) {
        --curBrightness;
      }
      else if (curBrightness < tarBrightness && state == 1 && curBrightness < 255) {
        ++curBrightness;
      }
    }
    else {
      if (state == 1) {
        curBrightness = tarBrightness;
      }
      else {
        curBrightness = 0;
      }
    }
    
    if (curBrightness == 0) {
      state = 0;
      digitalWrite(pwmPin, 0);
    }
    else if (curBrightness == 255) {
      state = 1;
      digitalWrite(pwmPin, 1);
    }
    else {
      digitalWrite(pwmPin, 1);
    }
    
    zcState = 0;
}

void zcDetectISR() {
  if (zcState == 0) {
    zcState = 1;
  
    if (curBrightness < 255 && curBrightness > 0) {
      digitalWrite(pwmPin, 0);
      
      int dimDelay = 30 * (255 - curBrightness) + 400;//400
      hw_timer_arm(dimDelay);
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
void dht_collect(void) {
  delay(2000);
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();
  // Read temperature as Fahrenheit (isFahrenheit = true)
  float f = dht.readTemperature(true);

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Compute heat index in Fahrenheit (the default)
  // float hif = dht.computeHeatIndex(f, h);
  // Compute heat index in Celsius (isFahreheit = false)
  // float hic = dht.computeHeatIndex(t, h, false);
  Serial.print("Temp:");
  Serial.print(t); Serial.println("oC");
  Serial.print("Humid:");
  Serial.print(h); Serial.println("%");
  DHT_Transmit(h, t);
}
void DHT_Transmit(float h, float t) {
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();

  JsonObject& DHT = root.createNestedObject("DHT");
  DHT["Temperature"] = t;
  DHT["Humidity"] = h;
  char char_reply[60];
  root.printTo(char_reply);
  Serial.println(char_reply);
  if (client.publish(mqtt_topic_bedroom_dht22, char_reply))
       Serial.println("Sent to MQTT server");
  else {
       Serial.println("Failed to send.Reconnecting to MQTT server");
       Connect();
       client.publish(mqtt_topic_bedroom_dht22, char_reply);
  }
}
