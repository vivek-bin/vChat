var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

router.get('/search',function(req,res){
	mongoose.model('User')
	.find({ 'username': { $regex: req.query.searchField, $options: 'i' } }, 'username', function(err,data){
		if(err){
			res.send(err);
		}
		for(var i=0;i<data.length;++i){
			if(data[i].username===req.user.username){
				data.splice(i,1);
			}
		}
		res.send({users: data});
	})
	.limit(15);
});

module.exports = router;
