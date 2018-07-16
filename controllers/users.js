'use strict';

module.exports = function(_, passport, User) {
  
  return {
    setRouting: function(router){
      router.get('/', this.indexPage);
      router.get('/signup', this.getSignUp);
      

      router.post('/', User.LoginValidation, this.postLogin);
      router.post('/signup', User.SignUpValidation, this.postSignUp);
    },

    indexPage: function(req, res) {
      const errors = req.flash('error');

      return res.render('index', {title: 'BSA18-APP | Login', messages: errors, hasErrors:
      errors.length > 0}); 
    },

    postLogin: passport.authenticate('local.login', {
      successRedirect: '/groupchat',
      failureRedirect: '/',
      failureFlash: true
    }),

    getSignUp: function(req, res) {
      const errors = req.flash('error');
    	return res.render('signup', {title: 'BSA18-APP | SignUp', messages: errors, hasErrors:
      errors.length > 0});
    },

    postSignUp: passport.authenticate('local.signup', {
      successRedirect: '/groupchat',
      failureRedirect: '/signup',
      failureFlash: true
    })
  }

}