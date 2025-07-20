#include <DistanceSensor.h>
#include <Servo.h>
#include <Stepper.h>

// Distance Sensor Pins
const int echoPin = 3;
const int trigPin = 2;
DistanceSensor sensor(trigPin, echoPin);

// Water Sensor Pins
int resval = 0;
int respin = A5;

// Temperature Sensor Pin
const int thermistorPin = A0;

// Servo Pins and Objects
Servo servo1;
Servo servo2;
int servo1Pin = 5;
int servo2Pin = 6;

// Stepper Motor Setup
int motorSpeed = 10;
Stepper myStepper(2048, 8, 10, 9, 11);

// Common Buzzer Pin
int buzzerPin = 4;

// Temperature Calculation Constants
float R_10k = 10000;
float logR_th, R_th, T_k, T;
float c1 = 1.009249522e-03, c2 = 2.378405444e-04, c3 = 2.019202697e-07;

bool isProcessCompleted = false;

void setup() {
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
  servo1.attach(servo1Pin);
  servo2.attach(servo2Pin);
}

void loop() {
  // Object Detection Task
  int distanceCm = sensor.getCM();
  float distanceIn = distanceCm / 2.54;
  Serial.print("Distance: ");
  Serial.print(distanceIn);
  Serial.println(" in");
  if (distanceIn <= 10) {
    tone(buzzerPin, 1000, 100);
    delay(200);
  }

  // Water Detection Task
  if (!isProcessCompleted) {
    resval = analogRead(respin);
    if (resval > 100) {
      Serial.println("Water Detected: Yes");
      tone(buzzerPin, 1000, 250);
      servo1.write(180);
      delay(2800);
      servo1.write(0);
      delay(2800);

      delay(10000);
      
      servo2.write(180);
      delay(2800);
      servo2.write(0);
      delay(120000);
      isProcessCompleted = true;
    } else {
      Serial.println("Water Detected: No");
    }
    delay(100);
  }

  // Elevated Temperature Detection Task
  int V_out = analogRead(thermistorPin);
  R_th = R_10k * (1023.0 / V_out - 1.0);
  logR_th = log(R_th);
  T_k = 1.0 / (c1 + c2 * logR_th + c3 * logR_th * logR_th * logR_th);
  T = T_k;
  Serial.print("Temperature: ");
  Serial.print(T);
  Serial.println(" C");
  if (T > 32.0) {
    myStepper.setSpeed(motorSpeed);
    myStepper.step(1536);
  }
delay(1000);
}