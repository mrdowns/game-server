window.onload = function() {
 
    var games = [];
    var socket = io.connect('http://localhost:3000');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
 
    socket.on('list', function (data) {
        games = [];
        if(data.length && data.length > 0) {
            var html = '';
            for(var i = 0; i < data.length; i++) {
                html += data[i].gameId + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.onclick = function() {
        var text = field.value;
        socket.emit('create', { message: text });
    };
 
};