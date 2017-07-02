var express = require('express');
var router = express.Router();

module.exports = function(passport){
	//sends successful login state back to angular
	router.get('/success', function(req, res){
		res.send({state: 'success', user: req.user?{username : req.user.username,last_seen: req.user.last_seen}:null, message: 'Authentication Successful!'});
	});

	//sends failure login state back to angular
	router.get('/failure', function(req, res){
		res.send({state: 'failure', user: null, message: 'Invalid username or password'});
	});

	//sign in
	router.post('/signin', passport.authenticate('signin', {
		successRedirect: '/users/success',
		failureRedirect: '/users/failure'
	}));

	//sign up
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/users/success',
		failureRedirect: '/users/failure'
	}));

	//log out
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	

	return router;
};