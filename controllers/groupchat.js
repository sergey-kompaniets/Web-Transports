
module.exports = function() {
	return{
		setRouting: function(router) {
			router.get('/groupchat', this.groupChat);
		},

		groupChat: function(req, res) {
      return res.render('groupchat', {title: 'BSA18APP | Group Chat', user:req.user});
    }
	}
}