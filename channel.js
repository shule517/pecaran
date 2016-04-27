var httpClient = require('cheerio-httpcli');

exports.channels = function(req, res){
    readYp(res);
};

function readYp(res) {
    getHtml('http://localhost:3000/index.txt')
    .then(function(body) {

        var channels = [];

        var lines = body.split("\n");
        lines.forEach( function(line) {
            elements = line.split("<>");
            console.log(elements[0]);

            channel = {
                name:elements[0],
                id:elements[1],
                contactUrl:elements[3],
                genre:elements[4],
                details:elements[5],
                comments:elements[17]
            };

            channels.push(channel);
        });
        res.send(channels);
    })
    .then(function(body){
        console.log('then2');
    });
    console.log('end');
};

function getHtml(url) {
    return new Promise(function(resolve, reject){
        httpClient.fetch(url, { q: 'node.js' }, function (err, $, res, body) {
            resolve(body);
        });
    });
};
