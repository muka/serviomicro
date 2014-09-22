
var rest = require('restler');

 // your serviomicro url
var url = "http://127.0.0.1:3000/";

// fill your apiKey
var key = "";

// soid from gluethings
var soid = "";

// stream name
var stream = "";

rest.get(url, {

    headers: {
        soid: soid,
        stream: stream,
        authorization: key,
    }

})
.on('complete', function(c) {
    console.info(c);
});