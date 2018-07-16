class Users {
	constructor(){
		this.users = [];
	}

	AddUserData(id, name) {
		let users = {id, name};
		this.users.push(users);
		return users;
	}

	RemoveUser(id) {
		let user = this.GetUser(id);
		if(user) {
			this.users = this.users.filter(user => user.id !== id);			
		}
		return user;
	}

	GetUser(id) {
		let getUser = this.users.filter(userId => {
			return userId.id === id;
		})[0];
		return getUser;
	}

	GetUsersList() {
		// console.log(this.users)
		let users = this.users.filter(user => user);
		
		let namesArray = users.map(user => user.name);
		// console.log(namesArray)
		return namesArray;
	}
}

module.exports = {Users};