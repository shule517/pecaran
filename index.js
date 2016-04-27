var express = require('express')
    app = express(),
    api = require('./channel');

app.use(express.static(__dirname + '/public'));
app.listen(3000);
console.log('server starting');

//indexText = channel.readYp();





// var express = require('express'),
//   app = express(),
//   api = require('./api/api');
//   // app.use(app.router);
//   app.use(express.static(__dirname + '/public'));

app.get('/api/channels', api.channels);

//   app.get('/api/images', api.images);
//   app.listen(3000);
//   console.log('server starting');
// // app.set('views', __dirname + '/views');
// // app.set('view engine', 'ejs');

// // app.use(express.logger('dev'));
// // 不要らしい

// /*
// app.param('id', function(req, res, next, id){
//   var users = ['111', '2222', '3333'];
//   req.params.name = users[id];
//   next();
// });
// */

// /*
// app.get('/', function(req, res) {
//   //res.render('index');
//   var users = [
//     {"name":"suzuki", "score":12},
//     {"name":"shule", "score":23},
//     {"name":"jun", "score":3},
//     {"name":"jun2", "score":223},
//     {"name":"jun3", "score":43},
//   ];
//   res.render('index', {data:users});
// });
// */

// /*
// app.get('/hello/:id', function(req, res) {
//   res.send('hello ' + req.params.id + ' ' + req.params.name);
// });
// */

// /*
// app.get('/', function(req, res) {
//   res.sendfile(__dirname + '/public/index.html');
// //  res.send('hello world');
// });
// */

// /*
// app.get('/users/:name([a-z]+)', function(req, res) {
//   res.send("hello" + req.params.name);
// });
// */

// /*
// app.get('/api/users', function(req, res){
//   var users = [
//     {"name":"suzuki", "score":12},
//     {"name":"shule", "score":23},
//     {"name":"jun", "score":3},
//     {"name":"jun2", "score":223},
//     {"name":"jun3", "score":43},
//     {"name":"ane", "score":143},
//   ];
//   res.send(users);
// })
// */
