var async = require('async'),
    mcping = require('mc-ping-updated'),
    _ = require('underscore'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express();

mongoose.connect('mongodb://localhost:27017/wheee');

app.set('view engine', 'jade');
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    next();
});

app.use(morgan('dev'));



app.get('/', function(req, res) {
    var ports = _.range(25561, 25580);
    var address = 'wheee.org';
    var servers = _.map(ports, function(port) { return address + ':' + port; });
    var serverResponses = [];

    async.each(ports, function(port, callback) {
        mcping(address, port, function(err, res) {
            if (err) {
                // skip getting any information from the response, probably the server was down or there never was one available on this port
                callback();
            } else {
                if (typeof res.description != 'string') {
                    res.description = res.description.text;
                }
                res.description = res.description.replace(/§.{1}/g, '');
                serverResponses.push({port: port, info: res});
                callback();
            }
        });
    }, function(err) {
        if (err) {
            console.log(err);
            res.send('Error: ' + err);
        } else {
            res.render('index', {servers: _.sortBy(serverResponses, function(server) {return server.port;})});
        }
    });
});

app.route('/login')
    .get(function(req, res) {
        res.send("login form goes here");
    })
    .post(function(req, res) {
        res.send("processing the login form");
    });

var apiRouter = express.Router();

apiRouter.get('/', function(req, res) {
    res.json({message: "hey, it's an api!"});
});

app.use('/api', apiRouter);

app.listen(3000);
