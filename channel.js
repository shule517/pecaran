"use strict";

var httpClient = require('cheerio-httpcli');

exports.channels = function(req, res){
    readYp(res);
};

function readYp(res) {
    var channels = [];
    var promises = [];

    //getHtml('http://temp.orz.hm/yp/index.txt')
    //getHtml('http://bayonet.ddo.jp/sp//index.txt')
    getHtml('http://localhost:3000/index.txt')
    .then(function($) {


        var lines = $.html().split("\n");
        lines.forEach( function(line) {
            if (line.length == 0) {
                return;
            }
            var elements = line.split("<>");
            console.log(elements[0]);

            var url = elements[3];

            // ttp -> http
            if (url.startsWith('ttp')) {
                url = 'h' + url;
            }
            var index = url.indexOf('http://jbbs.shitaraba.net/bbs/read.cgi/');
            if (index != -1) {
                var elem = url.split('/');
                var genre = elem[5];
                var board = elem[6];
                url = 'http://jbbs.shitaraba.net/' + genre + '/' + board + '/';
            }

            var channel = {
                name:elements[0],
                id:elements[1],
                // contactUrl:url,
                contactUrl:elements[3],
                genre:elements[4],
                details:elements[5],
                comments:elements[17],
                icon:'http://pbs.twimg.com/profile_images/744418862/PeerstPlayer_Icon.png'
            };

            var promise = getHtml(url)
            .then(function($bbs){
                if ($bbs !== undefined) {
                    var imgSrc = $bbs('html > body > div > img').attr('src');
                    //if (imgSrc !== undefined) {
                        channel.icon = imgSrc;
                    //}
                }
                channels.push(channel);
            });
            promises.push(promise);
        });
    })
    .then(function(body){
        Promise.all(promises).then(function(values){
            console.log('promise all');
            res.send(channels);
        });
    });
};

function getHtml(url) {
    return new Promise(function(resolve, reject){
        httpClient.fetch(url, { q: 'node.js' }, function (err, $, res, body) {
            resolve($);
        });
    });
};
