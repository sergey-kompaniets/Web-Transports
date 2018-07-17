module.exports = function(io, Users) {

	const users = new Users();

	io.on('connection', (socket) => {
		console.log('User Connected');

		socket.on('join', (params, callback) => {
			// users.push(params.name);
			
			users.AddUserData(socket.id, params.name);
			// console.log('users', users);

			io.emit('usersList', users.GetUsersList());
			
			callback();

		});

		socket.on('createMessage', (message, callback) => {
			// console.log(message);
			io.emit('newMessage', {
				text: message.text,
				from: message.sender
			});

			// callback();
		});

		socket.on('disconnect', () => {
			let user = users.RemoveUser(socket.id);

			if (user) {
				io.emit('usersList', users.GetUsersList());
			}
		});

		

	});
}
