
module.exports = function(Users, async) {
	return{
		setRouting: function(router) {
			router.get('/groupchat', this.groupChat);
			router.post('/groupchat', this.groupPostPage);

			router.get('/logout', this.logout);
			
		},

		groupChat: function(req, res) {
			const name = req.params.name;
      
      async.parallel([
				function(callback) {
					Users.findOne({'username': req.user.username})
						.populate('request.userId')
						.exec((err, result) => {
							callback(err, result);
						})
				}
      ], (err, results) => {
      	const result1 = results[0];
      	console.log(result1);
      	 res.render('groupchat', {title: 'BSA18APP | Group Chat', user:req.user, data: result1});
				
      });
    },

    logout: function(req, res) {
    	req.logout();
    	req.session.destroy(err => res.redirect('/'));
    },


    groupPostPage: function(req, res) {
			async.parallel([
				function(callback) {
					if(req.body.receiverName) {
						Users.update({
							'username': req.body.receiverName,
							'request.userId': {$ne: req.user._id},
							'friendsList.friendId': {$ne: req.user._id}
						},
						{
							$push: {request: {
								userId: req.user._id,
								username: req.user.username
							}},
							$inc: {totalRequest: 1}
						}, (err, count) => {
							callback(err, count);
						})
					}
				},

				function(callback){
					if(req.body.receiverName) {
						Users.update({
							'username': req.user.username,
							'sentRequest.username': {$ne: req.body.receiverName}
						},
						{
							$push: {sentRequest: {
								username: req.body.receiverName
							}}
						}, (err, count) => {
							callback(err, count);
						})
					}
				}
			], (err, results) => {
				// console.log(req.params.name)
				res.redirect('/groupchat/' + req.params.name);
			});

			async.parallel([
				// updated in receiver
				function(callback) {
					if(req.body.senderId) {
						Users.update({
							'_id': req.user._id,
							'friendsList.friendId': {$ne: req.body.senderId}
						}, {
							$push: {friendsList: {
								friendId: req.body.senderId,
								friendName: req.body.senderName
							}},
							$pull: {request: {
								userId: req.body.senderId,
								username: req.body.senderName
							}},
							$inc: {totalRequest: -1}
						}, (err, count) => {
							callback(err, count);
						});
					}
				},
				
				// updated in sender
				function(callback) {
					if(req.body.senderId) {
						Users.update({
							'_id': req.body.senderId,
							'friendsList.friendId': {$ne: req.user._id}
						}, {
							$push: {friendsList: {
								friendId: req.user._id,
								friendName: req.user.username
							}},
							$pull: {sentRequest: {
								username: req.user.username
							}}
						}, (err, count) => {
							callback(err, count);
						});
					}
				},

				function(callback) {
					if(req.body.user_Id) {
						Users.update({
							'_id': req.user._id,
							'request.userId': {$eq: req.body.user_Id}
						}, {
							$pull: {request: {
								userId: req.user.user_Id
							}},
							$inc: {totalRequest: -1}
						}, (err, count) => {
							callback(err, count);
						});
					}
				},

				function(callback) {
					if(req.body.user_Id) {
						Users.update({
							'_id': req.body.user_Id,
							'sentRequest.username': {$eq: req.user.username}
						}, {
							$pull: {sentRequest: {
								username: req.user.username
							}}
						}, (err, count) => {
							callback(err, count);
						});
					}
				}

			], (err, results) => {
				res.redirect('/groupchat/' + req.params.name);
			});
		}
	}
}


