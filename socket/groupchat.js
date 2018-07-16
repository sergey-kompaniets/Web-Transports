module.exports = function(io) {
	io.on('connection', (socket) => {
		console.log('User Connected');

		socket.on('createMessage', ((message, callback) => {
			console.log(message);
			io.emit('newMessage', {
				text: message.text,
				from: message.sender
			});

			// callback();
		}));
	});
}