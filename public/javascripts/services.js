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
			$rootScope.user=undefined;
			$location.path('/');
		},function(error){
			console.log('AJAX failed during signout');
		});
	};
	LoginService.userAuthenticated = function(user){
		if(user){
			$rootScope.user=user.username;
			$location.path('/chat');
			return true;
		}
		return false;
	};
})

.service('SocketService',function($http,$rootScope,$location){
	var SocketService=this;
	var socket;
	
	//var socket={on: function(){},emit: function(){}};
	
	//SocketService.sendMessage;
	//SocketService.newMessage;
	
	SocketService.initSocket = function(){
		if(! $rootScope.user){
			$location.path('/');
			return false;
		}
		socket = io.connect();
		socket.emit('socket-init',{id: $rootScope.user});
		
		SocketService.sendMessage = function(message){
			message.sentBy = $rootScope.user;
	
			socket.emit('message',message);
		};

		SocketService.newMessage = function(callback){
			if(callback){
				socket.on('message',callback);
			}
		};
		
		SocketService.sendSearchRequest = function(searchField){
			socket.emit('search',{
				id: $rootScope.user, 
				searchField: searchField
			});
		}
		
		SocketService.getSearchList = function(callback){
			if(callback){
				console.log('got search');
				socket.on('search',callback);
			}
		};
		
		return true;
	};
})
