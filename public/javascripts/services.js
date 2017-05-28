angular.module('ChatApp')
.service('LoginService',function($http,$location,$rootScope){
	var LoginService=this;
	
	LoginService.signIn = function(userCreds){
		return $http.post('/users/signin',userCreds);
	};	
	LoginService.signUp = function(userCreds){
		return $http.post('/users/signup',userCreds);
	};
	LoginService.signOut = function(){
		$http.get('/users/signout')
		.then(function(res){
			$rootScope.user={};
			$location.path('/');
		},function(error){
			console.log('AJAX failed during signout');
		});
	};
	LoginService.userAuthenticated = function(user){
		if(user){
			$rootScope.user=user;
			$location.path('/chat');
			return true;
		}
		return false;
	};
})

.service('ChatService',function($http,$rootScope){
	var ChatService=this;
	
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

	ChatService.getNameList = function(searchField){
		return $http.get('/api/search',{params:{searchField:searchField}});
	}

})

.service('SocketService',function($http,$rootScope,$location){
	var SocketService=this;
	
	if(! $rootScope.user){
		$location.path('/');
	}
	
	var socket = io.connect();
	
	socket.emit('socket-init',{id: $rootScope.user.id});
	
	SocketService.sendMessage = function(message){
		message.sentBy = $rootScope.user.id;
		
		socket.emit('message',message);
	};
	
	SocketService.newMessage = function(callback){
		if(callback){
			//$rootScope.$apply(function(){
					socket.on('message',callback);
			//})
		}
	};

})
