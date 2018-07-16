$(document).ready(function () {
	let socket = io();
	let sender = $('#sender').val();

	socket.on('connect', function(){
		console.log('Yeah! Connected!');

	});

	socket.on('newMessage', function(data){
		console.log(data)
	});

	$('#message-form').on('submit', function(e){
		e.preventDefault();

		let msg = $('#msg').val();

		socket.emit('createMessage', {
			text: msg,
			sender: sender
		})
	});
});