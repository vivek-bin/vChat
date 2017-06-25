var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var User = mongoose.model('User');

module.exports = function(io){
	var connectedUsers={};
	io.on('connection',function(socket){
		socket.on('socket-init',function(data){
			connectedUsers[data.user.username] = socket.id;
			Message.find({sentTo: data.user.username, sentAt: {$gt: data.user.last_seen}},function(err,data){
				if(err){
					console.log("error sent new messages since last logout " + err)
					return;
				}
				io.to(socket.id).emit('message',data);
			});
		});
		
		socket.on('message',function(data){
			var newMessage = new Message();
			newMessage.messageText = data.message;
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
		
		socket.on('loadPrevious',function(data){
			var query = {$or: [{sentBy: data.username[0], sentTo: data.username[1], sentAt: { $lt: data.time}}, 
							   {sentBy: data.username[1], sentTo: data.username[0], sentAt: { $lt: data.time}}]};
			Message.find(query,function(err,data){
				if(err){
					console.log('error getting previous messages ' + err);
					return;
				}
				io.to(socket.id).emit('message',data);
			})
			.sort('-sentAt')
			.limit(15);
		});

		socket.on('search',function(data){
			User.find({ 'username': { $regex: data.searchField, $options: 'i' } }, 'username', function(err,userList){
				if(err){
					console.log('error while searching usernames in mongo')
					return;
				}
				for(var i=0;i<userList.length;++i){
					if(userList[i].username===data.username){
						userList.splice(i,1);
						continue;
					}
					userList[i].status = 0;
					if(connectedUsers[userList[i].username]){
						userList[i].status = 1;
					}
				}
				io.to(connectedUsers[data.username]).emit('search',userList);
			})
			.limit(15);
		});
		
		socket.on('refreshStatus',function(data){
			var statuses={};
			
			for(var i=0;i<data.length;++i){
				statuses[data[i]] = 0;
				if(connectedUsers[data[i]]){
					statuses[data[i]] = 1;
				}
			}
			io.to(socket.id).emit('refreshStatus',statuses);
		});
		
		socket.on('disconnect',function(){
			for(var id in connectedUsers){
				if(!connectedUsers.hasOwnProperty(id)){
					continue;
				}
				if(connectedUsers[id]===socket.id){
					User.findOneAndUpdate({ username : id }, { last_seen : Date.now() }, function(err,data){
						if(err){
							console.log("error while updating last seen " + err);
							return;
						}
					});
					connectedUsers[id]=undefined;
					break;
				}
			}
			
		});
	});

};