var mongoose = require('mongoose');

module.exports = function(io){
	var connectedUsers={};
	io.on('connection',function(socket){
		socket.on('socket-init',function(data){
			connectedUsers[data.id] = socket.id;
		});
		
		socket.on('message',function(data){
			var Message = mongoose.model('Message');
			var newMessage = new Message();
			newMessage.message = data.message;
			newMessage.sentBy = data.sentBy;
			newMessage.sentTo = data.sentTo;
			newMessage.sentAt = data.sentAt;
			
			newMessage.save(function(err) {
				if (err){
					console.log('Error in Saving message');  
				}
			});
			if(connectedUsers[data.sentTo]){
				io.to(connectedUsers[data.sentTo]).emit('message',data);
			}
		});
		
		socket.on('disconnect',function(){
			for(var id in connectedUsers){
				if(!connectedUsers.hasOwnProperty(id)){
					continue;
				}
				if(connectedUsers[id]===socket.id){
					connectedUsers[id]=undefined;
					break;
				}
			}
			
		});
	});

};