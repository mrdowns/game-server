var express = require('express');
var handlebars = require('express-handlebars');

var app = express();
var port = 3000;

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars());

app.get("/", function(req, res) {
	res.render('app');
});

app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
	socket.emit('message', { message: 'welcome' });
	socket.on('send', function (data) {
		io.sockets.emit('message', data);
	})
})

console.log("Listening on port " + port);