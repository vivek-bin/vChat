var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

router.get('/search',function(req,res){
	mongoose.model('User')
	.find({ 'username': new RegExp (req.query.searchField, 'i') }, 'username', function(err,data){
		if(err){
			res.send(err);
		}
		res.send({users: data.users});
	})
	.limit(15);
});

module.exports = router;
