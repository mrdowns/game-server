window.onload = function() {

    var games = [];
    var socket = io.connect('http://localhost:3000');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var playerId = Math.floor(Math.random() * 100000000);

    var infoBox = document.getElementById('player-info');
    infoBox.innerHTML = 'you are player: ' + playerId;

    socket.on('list', function (data) {
        games = [];
        if(data.length && data.length > 0) {
            var html = '';
            for(var i = 0; i < data.length; i++) {
                html += '<div><span class="game-id">' + data[i].gameId + '</span> <a class="join-game" href="#">Join</a></div>';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });

    socket.on('join', function (data) {
        console.log('someone joined something', data);
    });

    document.body.onclick = function (e) {
      if (e.target.className === 'join-game') {
        console.log('clicked to join a game', e);
        gameId = e.target.parentNode.querySelector('.game-id').textContent;
        socket.emit('join', { gameId: gameId, player: playerId });
      }
    };

    sendButton.onclick = function() {
        var text = field.value;
        socket.emit('create', { playerId: playerId, message: text });
    };

};
