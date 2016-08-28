var express = require('express');
var handlebars = require('express-handlebars');
var Game = require('./controllers/game.js');

var app = express();
var port = 3000;
var game = new Game();

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars());

app.get("/", function(req, res) {
	res.render('app');
});

app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {

	socket.emit('list', game.list());

	socket.on('create', function (data) {
		game.create(data.player);
		io.sockets.emit('list', game.list());
	});

	socket.on('join', function (data) {
		game.join(data.player, data.gameId);
		io.sockets.emit('join', data);
	});
});

console.log("Listening on port " + port);
