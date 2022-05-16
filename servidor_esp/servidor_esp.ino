#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <HTTPClient.h>
#include <iostream>
#include <ArduinoJson.hpp>
#include <ArduinoJson.h>

// RED A INTERNET
const char* ssid = "TP-Link_6C72";
const char* password = "16823099";
const char* server = "http://192.168.0.105:3001/api/v1/esp32/";

//RED STATIC
// Set your Static IP address
IPAddress local_IP(192, 168, 0, 101);
// Set your Gateway IP address
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 0, 0);
IPAddress primaryDNS(8, 8, 8, 8);   //optional
IPAddress secondaryDNS(8, 8, 4, 4); //optional

// PARAMETROS
String ruta = "34A";
String unidad = "48";
String ramal = "HEROES";

WebSocketsServer webSocket = WebSocketsServer(81);
WiFiClient espClient;


/*
 *   VARIABLES GLOBALES
 */
String hora_servidor = "ERROR";
String msm_ws = "ERROR";
String msm_res_api = "ERROR";
String mensaje_status = "ERROR";
String status_servidor = "ERROR";
String status_gps = "ERROR";
double longitud = -98.2037;
double latitud = 19.03392;
boolean boolean_SERVER = false;

/*
 * ********************************************************************
 *               Setup
 * ********************************************************************
*/
void setup() {
    // Setup basico
    Serial.begin(115200);
    delay(50);
    Serial.println("");
    Serial.println("");
    Serial.println("");
    setupWiFi();
    
    Serial.println("Longitud: " + String(longitud));
    Serial.println("Latitud: " + String(latitud));
      
    Serial.setDebugOutput(true);
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);
    Serial.println("Servidor webSocketEvent iniciado"); 
}


/*
 * ********************************************************************
 *            Programa principal
 * ********************************************************************
*/

void loop() {

    webSocket.loop();
    
}
