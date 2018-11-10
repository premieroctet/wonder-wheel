#include "MFRC522/MFRC522.h"

#define SS_PIN D1
#define RST_PIN D2

MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance.

String wheelCases[] = {
    "044653120a3c80",
    "043653120a3c80",
    "04513d92ec5a80",
    "043c4892ec5a81",
    "04374892ec5a81",
    "04454792ec5a81",
    "043f4e92ec5a81",
    "04244e92ec5a81",
    "04414892ec5a81",
    "04294e92ec5a81",
    "042e4e92ec5a81",
    "04354e92ec5a81",
    "043a4e92ec5a81",
    "04444e92ec5a81",
    "046f4e92ec5a81",
    "044c4c92ec5a81",
    "045f4392ec5a80",
    "04484d92ec5a81",
    "04e64992ec5a80",
    "04514c92ec5a81",
    "04564c92ec5a81",
    "04f04992ec5a80",
    "043e53120a3c80",
    "042d53120a3c80"
};

long chrono = 0;
long debounceDelay = 1000;

bool isInit = true;
bool isSpinning = false;

String valueToCommit = "";

void setup() {
  mfrc522.setSPIConfig();
  mfrc522.PCD_Init();
}

void loop() {
    if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
        if (!isSpinning) {
            Particle.publish("SPINNING", "true", 5, PRIVATE);
            isSpinning = true;
        }

        String UID = "";
        String label = "";
        
        for (byte i = 0; i < mfrc522.uid.size; i++) {
          UID += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
          UID += String(mfrc522.uid.uidByte[i], HEX);
        }
        
        mfrc522.PICC_HaltA();
        
       for (int i=0; i<24; i++){
            if (wheelCases[i] == UID){
                label = i + 1;
            }
        }

        if (!isInit) {
            valueToCommit = label;
            chrono = millis();
        }
        
        isInit = false;
    }
    
    if (valueToCommit != "" && (millis() - chrono) > debounceDelay) {
        Particle.publish("WHEEL_VALUE", valueToCommit, 5, PRIVATE); 
        valueToCommit="";
        isSpinning = false;
    }
}