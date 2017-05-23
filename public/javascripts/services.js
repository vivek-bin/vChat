angular.module('MyApp')
.service('LoginService',function($http,$location,$rootScope){
	var LoginService=this;
	
	LoginService.signIn = function(userCreds){
		return $http.post('/users/signin',userCreds);
	};	
	LoginService.signUp = function(userCreds){
		return $http.post('/users/signup',userCreds);
	};
	LoginService.userAuthenticated = function(user){
		if(user){
			$rootScope.user=user;
			$location.path = '/chat';
			return true;
		}
		return false;
	};
})

.service('ChatService',function($http,$rootScope){
	var ChatService=this;
	
	var socket = io.connect();
	
	socket.emit('socket-init',{id: $rootScope.user.id});
	
	ChatService.chats = [];
	var chat = {
		name: "",
		messages:[]
	};
	var message = {
		messageText:"",
		sentAt: "",
		sentByUser: true    //true = sent, false = recieved
	};
	
	ChatService.sendMessage = function(message){
		message.sentBy = $rootScope.user.id;
		message.sentAt = new Date();
		socket.emit('message',message);
	};
	
	socket.on('message',function(message){
		
		
	});
	
	ChatService.getNameList = function(searchField){
		return $http.get('chat/:'&searchField);
	}

})
