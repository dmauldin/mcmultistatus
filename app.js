var async = require('async'),
    mcping = require('mc-ping-updated'),
    _ = require('underscore'),
    express = require('express'),
    app = express();

app.set('view engine', 'jade');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    var ports = _.range(25565, 25570); // 25565 to 25569
    var address = 'wheee.org';
    var servers = _.map(ports, function(port) { return address + ':' + port; });
    var serverResponses = [];

    async.each(ports, function(port, callback) {
        mcping(address, port, function(err, res) {
            if (err) {
                callback(err);
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

app.listen(3000);

