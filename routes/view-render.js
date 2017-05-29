var express = require('express');
var router = express.Router();

/* render PUG partials */
router.get('/index', function(req, res) {
  res.render('index');
});

router.use(function (req, res, next) {
	//if authenticated, allow
	if(req.isAuthenticated()){
		return next();
	}
	// if the user is not authenticated then redirect to home
	res.redirect('/views/index');
});

router.get('/chat', function(req, res) {
  res.render('chat');
});

module.exports = router;
