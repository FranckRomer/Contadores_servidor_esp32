/*
 * ************************************************************************************************
 *                                          JSON
 *                                      Deserializacion 
 * ************************************************************************************************
*/
// Deserializacion 
void DeserializeObject(uint8_t num ,String payload ){   
    char buffer[1024];
    DynamicJsonDocument doc (32768);
    DeserializationError error = deserializeJson(doc, payload);
    if (error) { return; }

    String clase         = doc["clase"];
    String status_ws     = doc["status"];
    String tipo          = doc["Tipo"];


    doc["ruta"]        = ruta;
    doc["unidad"]      = unidad;
    doc["ramal"]       = ramal;

    payload = "";
    size_t n = serializeJson(doc, payload);
    //payload =  buffer;
    Serial.println("//////////////////////////////");
    Serial.println(payload);
    Serial.println("//////////////////////////////");
    
    if((clase == "CONTADOR" || clase == "BIA") && status_ws == "0"){
      Serial.println("POST API MODULES");
      POST_JSON_REGISTRO((num),String(payload),clase, tipo);
    }
    else if(clase == "GPS"){
      Serial.println("POST API GPS ");
      longitud = doc["longitud"];
      latitud = doc["latitud"];
      status_gps = msm_ws;
      PATCH_GPS((num),String(payload));
    }
    else if(status_ws == "1"){
      Serial.println("GET API STATUS");
      GET_STATUS((num),String(payload));
      //SerializeSTATUS();
    }
    else {
      Serial.println("NO IDENTIFICADO");
      webSocket.sendTXT(num,"NO ESTAS REGISTRADO");
      
    }
    
}

/*
 * ************************************************************************************************
 *                                          JSON
 *                                       Serializacion
 * ************************************************************************************************
*/
//Serializacion


void SerializeSTATUS(uint8_t num,String payload ) {
    //String dataSnd_string;
    char buffer[256];
    //dataSnd_string = String(json);
    StaticJsonDocument<300> doc;
    
    doc["longitud"]             = longitud;
    doc["latitud"]              = latitud;
    doc["status_server"]        = 0;  //status_server
    doc["status_bd"]            = 0;  //status_bd
    doc["status_activo"]        = 0;  //status_activo
    doc["status_reset_values"]  = 0;  //status_reset_values

    size_t n = serializeJson(doc, buffer);
    msm_res_api = buffer;
    Serial.println(msm_res_api);
    webSocket.sendTXT(num, msm_res_api);
    
}

void respuestaSERVER(uint8_t num ,String payload ) {
    //String dataSnd_string;
    char buffer[1024];
    DynamicJsonDocument doc (32768);
    DeserializationError error = deserializeJson(doc, payload);
    if (error) { return; }
    
    //dataSnd_string = String(json);

    doc["respuesta_SERVER"]        = boolean_SERVER;

    size_t n = serializeJson(doc, buffer);
    msm_res_api = buffer;
    webSocket.sendTXT(num, msm_res_api);
}


void statusGPS(uint8_t num,String payload ) {
    //String dataSnd_string;
    char buffer[256];
    //dataSnd_string = String(json);
    StaticJsonDocument<300> doc;
    
    doc["longitud"]             = longitud;
    doc["latitud"]              = latitud;


    size_t n = serializeJson(doc, buffer);
    msm_res_api = buffer;
    
}
