#include <Wire.h>
#include <LiquidCrystal.h>
#include <MPU9250_asukiaaa.h>

// Initialize the LCD pins
LiquidCrystal lcd(12, 11, 5, 4, 3, 2); // RS, E, D4, D5, D6, D7
MPU9250_asukiaaa mySensor;

void setup() {
  Wire.begin();
  Serial.begin(115200);
  
  mySensor.setWire(&Wire);
  mySensor.beginAccel();

  lcd.begin(16, 2); // set up the LCD's number of columns and rows
  lcd.print("Tilt Angle:");
}

void loop() {
  mySensor.accelUpdate();
  float ax = mySensor.accelX();
  float ay = mySensor.accelY();
  float az = mySensor.accelZ();
  
  // Calculate the tilt angle using the X and Y accelerometer values
  float tiltAngle = atan2(ay, ax) * (180.0 / PI);

  lcd.setCursor(0, 1); // move to the beginning of the second row
  lcd.print("Angle: ");
  lcd.print(tiltAngle, 1); // print the tilt angle with 2 decimal places
  lcd.print("  "); // print spaces to clear leftover digits if the number gets shorter
  
  delay(100); // wait a bit before updating again
}
