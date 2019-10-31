/*
  ESP8266 Blink by Simon Peter
  Blink the blue LED on the ESP-01 module
  This example code is in the public domain

  The blue LED on the ESP-01 module is connected to GPIO1
  (which is also the TXD pin; so we cannot use Serial.print() at the same time)

  Note that this sketch uses LED_BUILTIN to find the pin with the internal LED
*/
int so4 = 0;
int so5 = 0;
void setup() {
  pinMode(4, INPUT);     // Initialize the LED_BUILTIN pin as an output
  pinMode(5, INPUT);
  pinMode(2, OUTPUT);
  digitalWrite(2, LOW);
}

// the loop function runs over and over again forever
void loop() {
  so4 = digitalRead(4);   // Turn the LED on (Note that LOW is the voltage level
  so5 = digitalRead(5);
  if ((so4 == HIGH) && (so5 == HIGH))
  {  digitalWrite(2, HIGH);
  }
  else digitalWrite(2, LOW);
}
