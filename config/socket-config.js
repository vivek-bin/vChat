
module.exports = function(io){
	var connectedUsers={};
	io.on('connection',function(socket){
		socket.on('socket-init',function(data){
			connectedUsers[data.id] = socket.id;
		});
		
		socket.on('message',function(data){
			var message = new mongoose.model('Message')();
			message.text = data.message;
			message.sentBy = data.sentBy;
			message.sentTo = data.sentTo;
			message.sentAt = data.sentAt;
			
			message.save(function(err) {
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