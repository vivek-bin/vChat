var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

/* GET home page. */
router.get('/mainpage', function(req, res) {
  res.render('chat', { title: 'vChat' });
});

router.get('/search/:searchField',function(req,res){
	mongoose.model('User')
	.find({ 'username': new RegExp (search, 'i') }, 'username', function(err,users){
		if(err){
			res.send(err);
		}
		res.send({users: users});
	})
	.limit(15);
});

module.exports = router;
