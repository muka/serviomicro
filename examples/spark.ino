/**
* Sample code for Spark.io to send Light sensor data to Compose
* developed at http://iotogether.compose-project.eu/
*/

#define API_KEY "your api key"
#define SO_ID "Service Object Id"
#define SO_STREAM "Service Object Stream name"

#define PIN_LIGHT 2


// This #include statement was automatically added by the Spark IDE.
#include "HttpClient/HttpClient.h"
HttpClient http;

// Headers currently need to be set at init, useful for API keys etc.
http_header_t headers[] = {

    { "Content-Type", "application/json" },

    { "Authorization" , API_KEY },
    { "Soid" , SO_ID },
    { "Stream" , SO_STREAM },

    { NULL, NULL } // NOTE: Always terminate headers will NULL
};

http_request_t request;
http_response_t response;

void setup()
{
    Serial.begin(9600);
}

void loop()
{

    int light = analogRead(PIN_LIGHT);

    Serial.print("Light raw: ");
    Serial.println(light);

    request.hostname = "localhost";
    request.port = 3000;
    request.path = "/";

    // Get request
    char b[100];
    sprintf(b, "{ \"light\": %i}", light);
    request.body = b;

    Serial.print("Request body: ");
    Serial.println(request.body);

    http.post(request, response, headers);

    Serial.print("Application>\tResponse status: ");
    Serial.println(response.status);
    Serial.print("\tResponse Body: ");
    Serial.println(response.body);

    delay(2500);
}
