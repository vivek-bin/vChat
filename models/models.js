var mongoose = require('mongoose');

mongoose.model('Message', new mongoose.Schema({
	sentBy: String,
	sentTo: String,
	sentAt: {type: Date, default: Date.now},
	messageText: String
}));

mongoose.model('User', new mongoose.Schema({
	username: String,
	password: String, //hash created from password
	created_at: {type: Date, default: Date.now},
	last_seen: Date
}));

//utility functions
exports.findByUsername = function(userName, callback){
	mongoose.model('User').findOne({ username: userName}, function(err, user){
		if(err){
			return callback(err);
		}
		//success
		return callback(null, user);
	});
}

exports.findById = function(id, callback){
	mongoose.model('User').findById(id, function(err, user){
		if(err){
			return callback(err);
		}
		return callback(null, user);
	});
}