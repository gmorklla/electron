var socket = io();

function enviarMsg() {
    var txt = $('#msg').val();
    socket.emit('send', txt);
    $('#msg').val('');
}

socket.on('chat', function(user, msg){
	$('#lista').append($('<li class="item">').text(msg));
});
