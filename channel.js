var httpClient = require('cheerio-httpcli');

exports.readYp = function read() {
    getHtml('http://localhost:3000/index.txt');
};

function getHtml(url) {
    httpClient.fetch(url, { q: 'node.js' }, function (err, $, res, body) {
        console.log(body);
    });
};
