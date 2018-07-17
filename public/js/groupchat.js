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
		let ol = $(`<ol></ol>`);

			users.map(user => {
				ol.append(`<p><a id="val" data-toggle="modal" data-target="#myModal">${user}</a></p>`);
			});

			$(document).on('click', '#val', function(){
        $('#name').text('@'+$(this).text());
        $('#receiverName').val($(this).text());
      });


			$('#numValue').text(` (${users.length})`);
			$('#users').html(ol);
		
	});

	socket.on('newMessage', function(data){
		console.log(data.from)
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