"use strict";

var httpClient = require('cheerio-httpcli');

exports.channels = function(req, res){

    var channelText = "";

    // var sp = getHtml('http://bayonet.ddo.jp/sp//index.txt').
    // then(function($){
    //     channelText += $.html();
    // });

    // var tp = getHtml('http://temp.orz.hm/yp/index.txt').
    // then(function($){
    //     channelText += $.html();
    // });

    // Promise.all([sp, tp]).then(function(values){
    //     readYp(res, channelText);
    // });

    var sample = getHtml('http://localhost:3000/index.txt')
    .then(function($){
        channelText += $.html();
    });

    Promise.all([sample]).then(function(values){
        readYp(res, channelText);
    });
};

function readYp(res, channelText) {
    var channels = [];
    var promises = [];
    var lines = channelText.split("\n");
    lines.forEach( function(line) {
        if (line.length == 0) {
            return;
        }
        var elements = line.split("<>");
        console.log(elements[0]);

        var channel = {
            name:elements[0],
            id:elements[1],
            contactUrl:elements[3],
            genre:elements[4],
            details:elements[5],
            comments:elements[17],
            icon:''
        };
        channels.push(channel);

        var url = elements[3];

        // ttp -> http
        if (url.startsWith('ttp')) {
            url = 'h' + url;
        }
        var promise = getImageUrl(url, channel);
        promises.push(promise);
        
        // 念のためSleep
        sleep(100);
    });

    Promise.all(promises).then(function(values){
        console.log('promise all');
        res.send(channels);
    });
};

function sleep (time){
    var time1 = new Date().getTime();
    var time2 = new Date().getTime();
  
    while ((time2 -  time1) < time){
        time2 = new Date().getTime();
    }
}

function getImageUrl(url, channel) {

    var promises = [];
    var bbsTopUrl = "";
    var bbsLocalRuleUrl = "";

    //　URLの作成
    var index = url.indexOf('http://jbbs.shitaraba.net/');
    if (index != -1) {

        index = url.indexOf('http://jbbs.shitaraba.net/bbs/read.cgi/');
        if (index != -1) {
            var elem = url.split('/');
            var genre = elem[5];
            var board = elem[6];
            bbsTopUrl = 'http://jbbs.shitaraba.net/' + genre + '/' + board + '/';
            bbsLocalRuleUrl = 'http://jbbs.shitaraba.net/' + genre + '/' + board + '/head.txt';
        } else {
            var elem = url.split('/');
            var genre = elem[3];
            var board = elem[4];
            bbsTopUrl = 'http://jbbs.shitaraba.net/' + genre + '/' + board + '/';
            bbsLocalRuleUrl = 'http://jbbs.shitaraba.net/' + genre + '/' + board + '/head.txt';
        }

    } else {
        // デバッグ
        channel.name += ":url ×";
    }

    var index = url.indexOf('http://jbbs.shitaraba.net/bbs/read.cgi/');
    if (index != -1) {
        var elem = url.split('/');
        var genre = elem[5];
        var board = elem[6];
        bbsTopUrl = 'http://jbbs.shitaraba.net/' + genre + '/' + board + '/';
        bbsLocalRuleUrl = 'http://jbbs.shitaraba.net/' + genre + '/' + board + '/head.txt';
    }

    // 掲示板ローカルルールの取得
    var promise = getHtml(bbsLocalRuleUrl)
    .then(function($bbs){
        if (channel.icon == "" && $bbs !== undefined) {
            channel.icon = getImageUrlBBSLocal($bbs);
            // デバッグ
            if (channel.icon != "") {
                channel.name += ":local ○";
            } else {
                channel.name += ":local ×";
            }
        }
        return getHtml(bbsTopUrl);
    })
    // 掲示板Top絵の取得
    .then(function($bbs){
        if (channel.icon == "" && $bbs !== undefined) {
            channel.icon = getImageUrlBBSTop($bbs);
            // デバッグ
            if (channel.icon != "") {
                channel.name += ":top ○";
            } else {
                channel.name += ":top ×";
            }
        }
    });
    return promise;
}

function getImageUrlBBSTop($bbs) {

    var imgSrc = "";

    // 掲示板Top絵を取得
    imgSrc = $bbs('html > body > div > img').attr('src');
    if (imgSrc !== undefined && imgSrc.startsWith('http://parts.jbbs.shitaraba.net/img/') == false) {
        return imgSrc;
    }

    imgSrc = $bbs('html > body > div img').attr('src');
    if (imgSrc !== undefined && imgSrc.startsWith('http://parts.jbbs.shitaraba.net/img/') == false) {
        return imgSrc;
    }

    // div img と同様の処理？
    // imgSrc = $bbs('html > body > div > a > img').attr('src');
    // if (imgSrc !== undefined) {
    //     return imgSrc;
    // }

    // imgSrc = $bbs('html > body > div > div > img').attr('src');
    // if (imgSrc !== undefined) {
    //     return imgSrc;
    // }

    $bbs('img')
    .each(function(index, element){
        if (element.attribs.src !== undefined &&
            element.attribs.src.startsWith('http://parts.jbbs.shitaraba.net/img/') == false
        ) {
            if (element.attribs.src !== undefined && element.attribs.src.startsWith('http')) {
                return element.attribs.src;
            } else {
                var host =  channel.contactUrl.split('/')[2];
                return 'http://' + host + "/" + element.attribs.src;
            }
        }
    });

    return "";
}

function getImageUrlBBSLocal($bbs) {

    // 画像の取得
    $bbs('img')
    .each(function(index, element){
        if (element.attribs.src !== undefined &&
            element.attribs.src.startsWith('http://parts.jbbs.shitaraba.net/img/') == false
        ) {
            if (element.attribs.src !== undefined && element.attribs.src.startsWith('http')) {
                return element.attribs.src;
            } else {
                var host =  channel.contactUrl.split('/')[2];
                return 'http://' + host + "/" + element.attribs.src;
            }
        }
    });

    // twitter id の取得
    var html = $bbs.html();
    var result = html.match(/twitter.com[/]([a-zA-Z0-9_]+)/i);

    if (result != null) {
        console.log('twitter:' + result[1]);
        var userId = result[1];
        return 'http://www.paper-glasses.com/api/twipi/' + userId + '/original';
    }

    return "";
}

function getHtml(url) {
    return new Promise(function(resolve, reject){
        httpClient.fetch(url, { q: 'node.js' }, function (err, $, res, body) {
            resolve($);
        });
    });
};
