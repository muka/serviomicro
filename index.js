
var ip = '127.0.0.1';
var port = '3000';

ip = process.argv[2] ? process.argv[2] : ip;
port = process.argv[3] ? process.argv[3] : port;

var composeDebug = false;

var compose = require('compose.io');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );


var compose_request = function(type, req, res) {

    var authorization = req.headers.authorization || null;
    var soid = null;
    var stream = null;
    var channel = null;

    var body = null;

    var _empty = function(o) { return Object.keys(o).length === 0; };

    var _fail = function(v, msg) {

        v = v || 500;
        msg = msg || "Request failed"

        console.warn(msg);
        res.status(v).send(msg).end();
    };

    var _failLog = function(e) {
        console.warn(e);
        _fail();
    };

    var _success = function() {
        res.status(200).end();
    };

    var _successResponse = function(streamData) {
        res.send(streamData.get());
    };

    /**
     * "X-" prefixes are deprecated, so going with custom ones unprefixed
     * http://tools.ietf.org/html/rfc6648
     */

    // check soid in headers
    if(req.headers.soid) {
        soid = req.headers.soid;
    }

    // check stream in headers
    if(req.headers.stream) {
        stream = req.headers.stream;
    }

    // check channel in headers
    if(req.headers.channel) {
        channel = req.headers.channel;
    }

    if(!_empty(req.body)) {
        body = req.body;
    }
    else if(!_empty(req.query)) {
        body = req.query;
    }
    else if (!_empty(req.params)) {
        body = req.params;
    }

    if(body) {
        if(body.soid) {
            soid = body.soid;
            delete body.soid;
        }

        if(body.stream) {
            stream = body.stream;
            delete body.stream;
        }

        if(body.channel) {
            channel = body.channel;
            delete body.channel;
        }

        if(body.data) {
            body = body.data;
        }

    }
    // check auth header
    if(!authorization) {
        return _fail(403, "Missing api key");
    }

    if(!soid) {
        return _fail(400, "Missing soid");
    }
    if(!stream) {
        return _fail(400, "Missing stream");
    }

    compose.setup({
        apiKey: req.headers.authorization,
        debug: composeDebug,
        transport: 'http'
    }).then(function(api) {

        return api.load(soid).then(function(so) {

            console.log("Requested SO id %s\n stream ", soid, stream);
            var streamObject = so.getStream(stream);

            console.log(streamObject);

            if(type === 'set') {
                streamObject.push(body)
                    .then(_success).catch(_failLog);
            }

            if(type === 'get') {
                streamObject.pull("lastUpdate")
                    .then(function(data) {

                        _successResponse( channel ?  r.get(channel) : r );
                    }).catch(_failLog);
            }

        }).catch(_failLog);

    })
    .catch(_failLog);

};

app.post('/', function(req, res) {
    compose_request('set', req, res);
});

app.get('/', function(req, res) {
    compose_request('get', req, res);
});

app.get('/now', function(req, res) {
    var now = Math.round((new Date()).getTime() / 1000);
    res.status(200).send(now.toString()).end();
});

var server = app.listen(port, ip, function() {
    console.log('Listening on http://%s:%s', ip, port);
});

