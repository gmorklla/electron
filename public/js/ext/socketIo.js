var socket = io();

function enviarMsg() {
    var txt = document.getElementById("msg").value;
    socket.emit('chat message', txt);
    document.getElementById("msg").value = '';
}

socket.on('chat message', function(msg){
	var node = document.createElement("li");
	node.className = "item";
	var textnode = document.createTextNode(msg);
	node.appendChild(textnode);
	document.getElementById("lista").appendChild(node);   
});
