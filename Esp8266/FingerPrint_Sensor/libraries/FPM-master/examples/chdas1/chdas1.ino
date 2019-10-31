/*
  ESP8266 Blink by Simon Peter
  Blink the blue LED on the ESP-01 module
  This example code is in the public domain

  The blue LED on the ESP-01 module is connected to GPIO1
  (which is also the TXD pin; so we cannot use Serial.print() at the same time)

  Note that this sketch uses LED_BUILTIN to find the pin with the internal LED
*/

void setup() {
  pinMode(4, INPUT);     // Initialize the LED_BUILTIN pin as an output
  pinMode(5, INPUT);
  pinMode(2, OUTPUT);
  digitalWrite(2, LOW);
  int so4 = 0;
  int so5 = 0;
}

// the loop function runs over and over again forever
void loop() {
  so4 = digitalRead(4);   // Turn the LED on (Note that LOW is the voltage level
  so5 = digitalRead(5);
  if ((so4 == HIGH) && (so5 == LOW))
  {  digitalWrite(2, HIGH);
  }
  
  // but actually the LED is on; this is because
  // it is active low on the ESP-01)
  //delay(1000);                      // Wait for a second
  //digitalWrite(LED_BUILTIN, HIGH);  // Turn the LED off by making the voltage HIGH
  //delay(2000);                      // Wait for two seconds (to demonstrate the active low LED)
}
