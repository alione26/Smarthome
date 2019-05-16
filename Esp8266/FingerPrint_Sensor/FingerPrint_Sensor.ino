/*
 * ESP8266 (Adafruit HUZZAH) Mosquitto MQTT Subscribe Example
 * Thomas Varnish (https://github.com/tvarnish), (https://www.instructables.com/member/Tango172)
 * Made as part of my MQTT Instructable - "How to use MQTT with the Raspberry Pi and ESP8266"
 */
#include <ESP8266WiFi.h> // Enables the ESP8266 to connect to the local network (via WiFi)
#include <PubSubClient.h> // Allows us to connect to, and publish to the MQTT broker
#include <SoftwareSerial.h>
#include <Wire.h>

#include <ArduinoJson.h>
#include "LiquidCrystal_PCF8574.h"
#include "FPM.h"

LiquidCrystal_PCF8574 lcd(0x27);
size_t strlen ( const char * str );

SoftwareSerial fserial(13, 15);

FPM finger(&fserial);
FPM_System_Params params;

// WiFi
// Make sure to update this for your own WiFi network!
int flag = 0;
const char* ssid = "ALADIN";
const char* wifi_password = "xuka03072016";

// MQTT
// Make sure to update this for your own MQTT Broker!
const char* mqtt_server = "192.168.1.200";
const char* mqtt_command_topic = "smarthome/fingerprint/command";
const char* mqtt_reply_topic = "smarthome/fingerprint/feedback";
const char* mqtt_username = "chilinh";
const char* mqtt_password = "chilinh123";
// The client id identifies the ESP8266 device. Think of it a bit like a hostname (Or just a name, like Greg).
const char* clientID = "ESP8266_1";
//lcd_var
const char* lcd_char;
// Initialise the WiFi and MQTT Client objects
WiFiClient wifiClient;
PubSubClient client(mqtt_server, 1883, wifiClient); // 1883 is the listener port for the Broker

void ReceivedMessage(char* topic, byte* payload, unsigned int length) {
  char command[length+1];
  for (unsigned int i = 0; i < length; i++) {
    command[i] = (char)(payload[i]);
  }
  command[length]='\0';
  DynamicJsonBuffer jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(command);
  if(!root.success()) {
  Serial.println("parseObject() failed");
//  return false;
  }
  const char* function = root["Function"];
  //Serial.println(command);
  Serial.println(function);
  // Handle the message we received
  int result_enroll = strcmp(function,"enroll");
  int result_empty = strcmp(function,"empty");
  int result_delete = strcmp(function,"delete");
  
  if (result_enroll == 0) {
    digitalWrite(LED_BUILTIN, HIGH); 
    int16_t fid;
    if (get_free_id(&fid)) {
        enroll_finger(fid);
        flag = 0;
    }
    else
        Serial.println("No free slot in flash library!");
    while (Serial.read() != -1);  // clear buffer
  }
  if (result_empty == 0) {
    digitalWrite(LED_BUILTIN, LOW);
    empty_database();
    flag = 0;
    Serial.print("Empty database");
    while (Serial.read() != -1);
  }
  if (result_delete == 0) {
    int delete_id = root["Delete_id"];
    deleteFingerprint(delete_id);
    flag = 0;
  }
}

bool Connect() {
  // Connect to MQTT Server and subscribe to the topic
  if (client.connect(clientID, mqtt_username, mqtt_password)) {
      client.subscribe(mqtt_command_topic);
      return true;
    }
    else {
      return false;
  }
}

void setup() {
  //pinMode(LED_BUILTIN, OUTPUT);
 // digitalWrite(LED_BUILTIN, LOW);
  pinMode(14, INPUT);
  
  attachInterrupt(14, identification, RISING);
  // Begin Serial on 115200
  // Remember to choose the correct Baudrate on the Serial monitor!
  // This is just for debugging purposes
  Serial.begin(115200);
  fserial.begin(57600);
  //setup_fingerprint
  if (finger.begin()) {
        finger.readParams(&params);
        Serial.println("Found fingerprint sensor!");
        Serial.print("Capacity: "); Serial.println(params.capacity);
        Serial.print("Packet length: "); Serial.println(FPM::packet_lengths[params.packet_len]);
    } else {
        Serial.println("Did not find fingerprint sensor :(");
        while (1) yield();
    }
  //setup_wifi
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
void identification(void) {
  flag = 1;
}

void loop() {
  // If the connection is lost, try to connect again
  if (!client.connected()) {
    Connect();
  }
  if (flag) {
    search_database();
    flag = 0;
  }
  //search_database();
  
  // client.loop() just tells the MQTT client code to do what it needs to do itself (i.e. check for messages, etc.)
  client.loop();
  //search_database();
  // Once it has done all it needs to do for this cycle, go back to checking if we are still connected.
}

//function getting free id to store new finger
bool get_free_id(int16_t * fid) {
    int16_t p = -1;
    for (int page = 0; page < (params.capacity / FPM_TEMPLATES_PER_PAGE) + 1; page++) {
        p = finger.getFreeIndex(page, fid);
        switch (p) {
            case FPM_OK:
                if (*fid != FPM_NOFREEINDEX) {
                    Serial.print("Free slot at ID ");
                    Serial.println(*fid);
                    return true;
                }
                break;
            case FPM_PACKETRECIEVEERR:
                Serial.println("Communication error!");
                return false;
            case FPM_TIMEOUT:
                Serial.println("Timeout!");
                return false;
            case FPM_READ_ERROR:
                Serial.println("Got wrong PID or length!");
                return false;
            default:
                Serial.println("Unknown error!");
                return false;
        }
        yield();
    }
    
    Serial.println("No free slots!");
    return false;
}

// function_enroll_finger
int16_t enroll_finger(int16_t fid) {
    int16_t p = -1;
    const char *lcd_char;
    Serial.println("Waiting for valid finger to enroll");
    while (p != FPM_OK) {
        p = finger.getImage();
        switch (p) {
            case FPM_OK:
                Serial.println("Image taken");
                break;
            case FPM_NOFINGER:
                Serial.println(".");
                fp_lcd(lcd_char = "Waiting for finger");
                break;
            case FPM_PACKETRECIEVEERR:
                Serial.println("Communication error");
                break;
            case FPM_IMAGEFAIL:
                Serial.println("Imaging error");
                break;
            case FPM_TIMEOUT:
                Serial.println("Timeout!");
                break;
            case FPM_READ_ERROR:
                Serial.println("Got wrong PID or length!");
                break;
            default:
                Serial.println("Unknown error");
                break;
        }
        yield();
    }
    // OK success!

    p = finger.image2Tz(1);
    switch (p) {
        case FPM_OK:
            Serial.println("Image converted");
            break;
        case FPM_IMAGEMESS:
            Serial.println("Image too messy");
            return p;
        case FPM_PACKETRECIEVEERR:
            Serial.println("Communication error");
            return p;
        case FPM_FEATUREFAIL:
            Serial.println("Could not find fingerprint features");
            return p;
        case FPM_INVALIDIMAGE:
            Serial.println("Could not find fingerprint features");
            return p;
        case FPM_TIMEOUT:
            Serial.println("Timeout!");
            return p;
        case FPM_READ_ERROR:
            Serial.println("Got wrong PID or length!");
            return p;
        default:
            Serial.println("Unknown error");
            return p;
    }

    Serial.println("Remove finger");
    delay(2000);
    p = 0;
    while (p != FPM_NOFINGER) {
        p = finger.getImage();
        yield();
    }

    p = -1;
    Serial.println("Place same finger again");
    while (p != FPM_OK) {
        p = finger.getImage();
        switch (p) {
            case FPM_OK:
                Serial.println("Image taken");
                break;
            case FPM_NOFINGER:
                Serial.print(".");
                const char *lcd_char;
                fp_lcd(lcd_char = "Finger again...");
                break;
            case FPM_PACKETRECIEVEERR:
                Serial.println("Communication error");
                break;
            case FPM_IMAGEFAIL:
                Serial.println("Imaging error");
                break;
            case FPM_TIMEOUT:
                Serial.println("Timeout!");
                break;
            case FPM_READ_ERROR:
                Serial.println("Got wrong PID or length!");
                break;
            default:
                Serial.println("Unknown error");
                break;
        }
        yield();
    }

    // OK success!

    p = finger.image2Tz(2);
    switch (p) {
        case FPM_OK:
            Serial.println("Image converted");
            break;
        case FPM_IMAGEMESS:
            Serial.println("Image too messy");
            return p;
        case FPM_PACKETRECIEVEERR:
            Serial.println("Communication error");
            return p;
        case FPM_FEATUREFAIL:
            Serial.println("Could not find fingerprint features");
            return p;
        case FPM_INVALIDIMAGE:
            Serial.println("Could not find fingerprint features");
            return p;
        case FPM_TIMEOUT:
            Serial.println("Timeout!");
            return false;
        case FPM_READ_ERROR:
            Serial.println("Got wrong PID or length!");
            return false;
        default:
            Serial.println("Unknown error");
            return p;
    }


    // OK converted!
    p = finger.createModel();
    if (p == FPM_OK) {
        Serial.println("Prints matched!");
    } else if (p == FPM_PACKETRECIEVEERR) {
        Serial.println("Communication error");
        return p;
    } else if (p == FPM_ENROLLMISMATCH) {
        Serial.println("Fingerprints did not match");
        fp_lcd(lcd_char = "Fingerprints did not match");
        return p;
    } else if (p == FPM_TIMEOUT) {
        Serial.println("Timeout!");
        return p;
    } else if (p == FPM_READ_ERROR) {
        Serial.println("Got wrong PID or length!");
        return p;
    } else {
        Serial.println("Unknown error");
        return p;
    }

    Serial.print("ID "); Serial.println(fid);
    p = finger.storeModel(fid);
    if (p == FPM_OK) {
        Serial.println("Stored!");
        fp_lcd(lcd_char = "Stored");
        DynamicJsonBuffer jsonBuffer;
        JsonObject& root = jsonBuffer.createObject();

        JsonObject& feedback = root.createNestedObject("feedback");
        feedback["enroll"] = "enrolled";
        feedback["id"] = fid;
        char char_reply[50];
        root.printTo(char_reply);
        Serial.println(char_reply);
        if (client.publish(mqtt_reply_topic, char_reply))
            Serial.println("Replied to MQTT server");
        else {
          Serial.println("Failed to reply.Reconnecting to MQTT server");
          Connect();
          client.publish(mqtt_reply_topic, char_reply);
        }
        return 0;
    } else if (p == FPM_PACKETRECIEVEERR) {
        Serial.println("Communication error");
        return p;
    } else if (p == FPM_BADLOCATION) {
        Serial.println("Could not store in that location");
        return p;
    } else if (p == FPM_FLASHERR) {
        Serial.println("Error writing to flash");
        return p;
    } else if (p == FPM_TIMEOUT) {
        Serial.println("Timeout!");
        return p;
    } else if (p == FPM_READ_ERROR) {
        Serial.println("Got wrong PID or length!");
        return p;
    } else {
        Serial.println("Unknown error");
        return p;
    }
}

//function_empty_database
void empty_database(void) {
    int16_t p = finger.emptyDatabase();
    const char *lcd_char;
    if (p == FPM_OK) {
        Serial.println("Database empty!");
        fp_lcd(lcd_char = "Database empty!");
        DynamicJsonBuffer jsonBuffer;
        JsonObject& root = jsonBuffer.createObject();

        JsonObject& feedback = root.createNestedObject("feedback");
        feedback["empty"] = "emptied";
        char char_reply[50];
        root.printTo(char_reply);
        Serial.println(char_reply);
        if (client.publish(mqtt_reply_topic, char_reply))
            Serial.println("Replied to MQTT server");
        else {
          Serial.println("Failed to reply.Reconnecting to MQTT server");
          Connect();
          client.publish(mqtt_reply_topic, char_reply);
        }
    }
    else if (p == FPM_PACKETRECIEVEERR) {
        Serial.print("Communication error!");
    }
    else if (p == FPM_DBCLEARFAIL) {
        Serial.println("Could not clear database!");
    } 
    else if (p == FPM_TIMEOUT) {
        Serial.println("Timeout!");
    } 
    else if (p == FPM_READ_ERROR) {
        Serial.println("Got wrong PID or length!");
    } 
    else {
        Serial.println("Unknown error");
    }
}

//function_delete
int deleteFingerprint(int fid) {
    int p = -1;
    Serial.println(fid);
    p = finger.deleteModel(fid);

    if (p == FPM_OK) {
        Serial.println("Deleted!");
        const char* lcd_char;
        fp_lcd(lcd_char = "Deleted");
        DynamicJsonBuffer jsonBuffer;
        JsonObject& root = jsonBuffer.createObject();

        JsonObject& feedback = root.createNestedObject("feedback");
        feedback["delete"] = "deleted";
        feedback["id"] = fid;
        char char_reply[50];
        root.printTo(char_reply);
        Serial.println(char_reply);
        if (client.publish(mqtt_reply_topic, char_reply))
            Serial.println("Replied to MQTT server");
        else {
          Serial.println("Failed to reply.Reconnecting to MQTT server");
          Connect();
          client.publish(mqtt_reply_topic, char_reply);
        }
    } else if (p == FPM_PACKETRECIEVEERR) {
        Serial.println("Communication error");
        return p;
    } else if (p == FPM_BADLOCATION) {
        Serial.println("Could not delete in that location");
        return p;
    } else if (p == FPM_FLASHERR) {
        Serial.println("Error writing to flash");
        return p;
    } else if (p == FPM_TIMEOUT) {
        Serial.println("Timeout!");
        return p;
    } else if (p == FPM_READ_ERROR) {
        Serial.println("Got wrong PID or length!");
        return p;
    } else {
        Serial.print("Unknown error: 0x"); Serial.println(p, HEX);
        return p;
    }
}

//function_search_database
int search_database(void) {
    int16_t p = -1;
    const char* lcd_char;
    /* first get the finger image */
    Serial.println("Waiting for valid finger");
    while (p != FPM_OK) {
        p = finger.getImage();
        switch (p) {
            case FPM_OK:
                Serial.println("Image taken");
                break;
            case FPM_NOFINGER:
                Serial.println(".");
                fp_lcd(lcd_char = "Waiting for finger");
                break;
            case FPM_PACKETRECIEVEERR:
                Serial.println("Communication error");
                break;
            case FPM_IMAGEFAIL:
                Serial.println("Imaging error");
                break;
            case FPM_TIMEOUT:
                Serial.println("Timeout!");
                break;
            case FPM_READ_ERROR:
                Serial.println("Got wrong PID or length!");
                break;
            default:
                Serial.println("Unknown error");
                break;
        }
        yield();
    }

    /* convert it */
    p = finger.image2Tz();
    switch (p) {
        case FPM_OK:
            Serial.println("Image converted");
            break;
        case FPM_IMAGEMESS:
            Serial.println("Image too messy");
            return p;
        case FPM_PACKETRECIEVEERR:
            Serial.println("Communication error");
            return p;
        case FPM_FEATUREFAIL:
            Serial.println("Could not find fingerprint features");
            return p;
        case FPM_INVALIDIMAGE:
            Serial.println("Could not find fingerprint features");
            return p;
        case FPM_TIMEOUT:
            Serial.println("Timeout!");
            return p;
        case FPM_READ_ERROR:
            Serial.println("Got wrong PID or length!");
            return p;
        default:
            Serial.println("Unknown error");
            return p;
    }

    Serial.println("Remove finger");
    p = 0;
    while (p != FPM_NOFINGER) {
        p = finger.getImage();
        yield();
    }
    Serial.println();

    /* search the database for the converted print */
    uint16_t fid, score;
    p = finger.fingerFastSearch(&fid, &score);
    if (p == FPM_OK) {
        Serial.println("Found a print match!");
        DynamicJsonBuffer jsonBuffer;
        JsonObject& root = jsonBuffer.createObject();

        JsonObject& feedback = root.createNestedObject("feedback");
        feedback["find"] = "found";
        feedback["id"] = fid;
        char char_reply[50];
        root.printTo(char_reply);
        Serial.println(char_reply);
        if (client.publish(mqtt_reply_topic, char_reply))
            Serial.println("Replied to MQTT server");
        else {
          Serial.println("Failed to reply.Reconnecting to MQTT server");
          Connect();
          client.publish(mqtt_reply_topic, char_reply);
        }
    } else if (p == FPM_PACKETRECIEVEERR) {
        Serial.println("Communication error");
        return p;
    } else if (p == FPM_NOTFOUND) {
        Serial.println("Did not find a match");
        return p;
    } else if (p == FPM_TIMEOUT) {
        Serial.println("Timeout!");
        return p;
    } else if (p == FPM_READ_ERROR) {
        Serial.println("Got wrong PID or length!");
        return p;
    } else {
        Serial.println("Unknown error");
        return p;
    }

    // found a match!
    Serial.print("Found ID #"); Serial.print(fid);
    Serial.print(" with confidence of "); Serial.println(score);
}
//function_lcd
void fp_lcd(const char * lcd_char) {
    Wire.begin();
    Wire.beginTransmission(0x27);
    lcd.begin(16, 2);
    lcd.setBacklight(64);
    lcd.home(); lcd.clear();
    lcd.print(lcd_char);
    delay(500);
    size_t len_of_char = strlen(lcd_char);
    size_t i;
    if (len_of_char > 17) {
        for (i=0; i < (len_of_char - 16); i++) {
            lcd.scrollDisplayLeft();
            delay(150);
        }
        len_of_char = 17;
    }

}
