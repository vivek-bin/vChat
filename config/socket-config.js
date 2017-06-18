var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var User = mongoose.model('User');

module.exports = function(io){
	var connectedUsers={};
	io.on('connection',function(socket){
		socket.on('socket-init',function(data){
			connectedUsers[data.id] = socket.id;
		});
		
		socket.on('message',function(data){
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
				io.to(connectedUsers[data.sentTo]).emit('message',[data]);
			}
		});

		socket.on('search',function(data){
			User.find({ 'username': { $regex: data.searchField, $options: 'i' } }, 'username', function(err,userList){
				if(err){
					console.log('error while searching usernames in mongo')
					return;
				}
				for(var i=0;i<userList.length;++i){
					if(userList[i].username===data.id){
						userList.splice(i,1);
						continue;
					}
					userList[i].status = 0;
					if(connectedUsers[userList[i].username]){
						userList[i].status = 1;
					}
				}
				io.to(connectedUsers[data.id]).emit('search',userList);
			})
			.limit(15);
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