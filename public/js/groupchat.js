$(document).ready(function () {
	let socket = io();
	let sender = $('#sender').val();

	socket.on('connect', function(){
		console.log('Yeah! Connected!');

		let params = {
			name: sender
		}

		socket.emit('join', params, function(){

		});

	});

	socket.on('usersList', function(users) {
		let ol = $('<ol></ol>');

			for(let i = 0; i < users.length; i++) {
				ol.append('<p>'+users[i]+'</p>');
			}

			$('#users').html(ol);
		
	});

	socket.on('newMessage', function(data){
		console.log(data)
		let template = $('#message-template').html();
		let message = Mustache.render(template, {
			text: data.text,
			sender: data.from
		});

		$('#messages').append(message);
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