ServioMicro
===

Minimal middleware to store/fetch data to/from Servioticy API.


#Setup

Install deps with `npm install`

Run with

`node index.js`

or additionally specifying host and port

`node index.js 192.168.10.2 80`

#Usage

Enables an http service to interact with easier payload with servioticy, potentially avoiding json

To get the last value of a stream and, optionally, of a channel

```
GET /
Authorization: [api key]
Soid: [service object soid]
Stream: [service object stream]
Channel: [Optional, channel name to return]


```

To set the value of a stream


```
POST /
Authorization: [api key]
Soid: [service object soid]
Stream: [service object stream]
Content-Type: application/x-www-form-urlencoded

channel1=channel1Value&channel2=channel2Value
```

or with json

```
POST /
Authorization: [api key]
Soid: [service object soid]
Stream: [service object stream]
Content-Type: application/json

{ "channel1": "channel1Value", "channel2" }
```

#License

MIT