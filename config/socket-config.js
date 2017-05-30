
module.exports = function(io){
	var connectedUsers={};
	io.on('connection',function(socket){
		socket.on('socket-init',function(data){
			connectedUsers[data.id] = socket.id;
		});
		
		socket.on('message',function(data){
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