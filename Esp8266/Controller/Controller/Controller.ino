/*
 * ESP8266 (Adafruit HUZZAH) Mosquitto MQTT Subscribe Example
 * Thomas Varnish (https://github.com/tvarnish), (https://www.instructables.com/member/Tango172)
 * Made as part of my MQTT Instructable - "How to use MQTT with the Raspberry Pi and ESP8266"
 */
#include <ESP8266WiFi.h> // Enables the ESP8266 to connect to the local network (via WiFi)
#include <PubSubClient.h> // Allows us to connect to, and publish to the MQTT broker
#include <ArduinoJson.h>

//DHT22 include
#include "DHT.h"
#define DHTPIN 2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

//lcd include
#include <Wire.h>
#include <LiquidCrystal_PCF8574.h>
LiquidCrystal_PCF8574 lcd(0x27);
//light status var
bool livStatus = 0;
bool kitStatus = 0;
bool livButtonError = 0;
bool kitButtonError = 0;
// WiFi
// Make sure to update this for your own WiFi network!
const char* ssid = "BKSMARTHOME";
const char* wifi_password = "chilinh123";

// MQTT
// Make sure to update this for your own MQTT Broker!
const char* mqtt_server = "192.168.0.200";
//const char* mqtt_topic = "smarthome/fingerprint/command";
const char* mqtt_topic_livingroom_light = "smarthome/light/livingroom";
//const char* mqtt_topic_bedroom_light = "smarthome/light/bedroom";
const char* mqtt_topic_kitchen_light = "smarthome/light/kitchen";
//const char* mqtt_topic_fan = "smarthome/fan/controll";
//const char* mqtt_fan_reply_topic = "smarthome/fan/feedback";
const char* mqtt_light_reply_topic = "smarthome/light/feedback";
const char* mqtt_transmit_dht22_topic = "smarthome/dht22";
const char* mqtt_username = "chilinh";
const char* mqtt_password = "chilinh123";
// The client id identifies the ESP8266 device. Think of it a bit like a hostname (Or just a name, like Greg).
const char* clientID = "ESP8266_2";

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
      client.subscribe(mqtt_topic_livingroom_light);
      //client.subscribe(mqtt_topic_bedroom_light);
      client.subscribe(mqtt_topic_kitchen_light);
      //client.subscribe(mqtt_topic_fan);
      return true;
    }
    else {
      return false;
  }
}
void livButton(void) {
  Serial.println("livButtonPressed");
  if ( livButtonError == 0 ) {
    livButtonError = 1;
    livStatus = digitalRead(15);
    if (livStatus) {
      digitalWrite(15, LOW);
      livStatus = 0;
    } else {
      digitalWrite(15, HIGH);
      livStatus = 1;
    }
  } else livButtonError = 0;
}
void kitButton(void) {
    if ( kitButtonError == 0 ) {
      kitButtonError = 1;
      kitStatus = digitalRead(13);
      if (kitStatus) {
          digitalWrite(13, LOW);
          kitStatus = 0;
      } else {
          digitalWrite(13, HIGH);
          kitStatus = 1;
    }
   } else kitButtonError = 0;
}

void setup() {
  pinMode(15, OUTPUT); //livingroom
  digitalWrite(15, LOW);
  pinMode(13, OUTPUT); //kitchen
  digitalWrite(13, LOW);
  attachInterrupt(14, livButton, RISING);
  attachInterrupt(12, kitButton, RISING);
//  pinMode(13, OUTPUT); //bedroom
//  digitalWrite(13, LOW);
//  pinMode(12, OUTPUT); //kitchen
//  digitalWrite(12, LOW);
//  pinMode(14, OUTPUT); //fan
//  digitalWrite(14, LOW);
  
  // dth22 begin
  dht.begin();
  // Begin Serial on 115200
  // Remember to choose the correct Baudrate on the Serial monitor!
  // This is just for debugging purposes

  //set up lcd
  int error;
  Serial.begin(115200);
  //Serial.begin(115200);
  Serial.println("LCD...");

  while (! Serial);

  Serial.println("Dose: check for LCD");

  // See http://playground.arduino.cc/Main/I2cScanner
  Wire.begin();
  Wire.beginTransmission(0x27);
  error = Wire.endTransmission();
  Serial.print("Error: ");
  Serial.print(error);

  if (error == 0) {
    Serial.println(": LCD found.");

  } else {
    Serial.println(": LCD not found.");
  } // if

  lcd.begin(16, 2); // initialize the lcd

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
  if (!strcmp(topic,mqtt_topic_livingroom_light)) {
    char* lightstatus;
    if (!strcmp(command,"on")) {
      digitalWrite(15, HIGH);
      Serial.println("livingroom on");
      lightstatus = "on";
      livStatus = 1;
    }
    if (!strcmp(command,"off")) {
      digitalWrite(15, LOW);
      Serial.println("livingroom off");
      lightstatus = "off";
      livStatus = 0;
    }
    feedback("livingroomlight", lightstatus);
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
  if (!strcmp(topic,mqtt_topic_kitchen_light)) {
    char* lightstatus;
     if (!strcmp(command,"on")) {
      digitalWrite(12, HIGH);
      Serial.println("kitchen_light on");
      lightstatus = "on";
      kitStatus = 1;
    }
    if (!strcmp(command,"off")) {
      digitalWrite(12, LOW);
      Serial.println("kitchen_light off");
      lightstatus = "off";
      kitStatus = 0;
    }
    feedback("kitchenlight", lightstatus);
  }
//  if (!strcmp(topic,mqtt_topic_fan)) {
//    char* fanstatus;
//     if (!strcmp(command,"on")) {
//      digitalWrite(14, HIGH);
//      Serial.println("fan on");
//      fanstatus = "on";
//    }
//    if (!strcmp(command,"off")) {
//      digitalWrite(14, LOW);
//      Serial.println("fan off");
//      fanstatus = "off";
//    }
//    fan_feedback("fan", fanstatus);
//  }
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
//void fan_feedback(char* fan, char* fanstatus) {
//  DynamicJsonBuffer jsonBuffer;
//  JsonObject& root = jsonBuffer.createObject();
//
//  JsonObject& feedback = root.createNestedObject("feedback");
//  feedback["fan"] = fan;
//  feedback["status"] = fanstatus;
//  char char_reply[60];
//  root.printTo(char_reply);
//  Serial.println(char_reply);
//  if (client.publish(mqtt_fan_reply_topic, char_reply))
//       Serial.println("Replied to MQTT server");
//  else {
//       Serial.println("Failed to reply.Reconnecting to MQTT server");
//        Connect();
//        client.publish(mqtt_fan_reply_topic, char_reply);
//  }
//}
void DHT_Transmit(float h, float t) {
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();

  JsonObject& DHT = root.createNestedObject("DHT");
  DHT["Temperature"] = t;
  DHT["Humidity"] = h;
  char char_reply[60];
  root.printTo(char_reply);
  Serial.println(char_reply);
  if (client.publish(mqtt_transmit_dht22_topic, char_reply))
       Serial.println("Sent to MQTT server");
  else {
       Serial.println("Failed to send.Reconnecting to MQTT server");
       Connect();
       client.publish(mqtt_transmit_dht22_topic, char_reply);
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
  float hif = dht.computeHeatIndex(f, h);
  // Compute heat index in Celsius (isFahreheit = false)
  float hic = dht.computeHeatIndex(t, h, false);
  DHT_Transmit(h, t);
  lcd.setBacklight(255);
  lcd.home(); lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Temperature:");
  lcd.print(t);
  lcd.setCursor(0, 1);
  lcd.print("Humidity:");
  lcd.print(h); lcd.print("%");
//  Serial.print("Humidity: ");
//  Serial.print(h);
//  Serial.print(" %\t");
//  Serial.print("Temperature: ");
//  Serial.print(t);
//  Serial.print(" *C ");
//  Serial.print(f);
//  Serial.print(" *F\t");
//  Serial.print("Heat index: ");
//  Serial.print(hic);
//  Serial.print(" *C ");
//  Serial.print(hif);
//  Serial.println(" *F");
}
