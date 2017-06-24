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
			$rootScope.user=user;
			$location.path('/chat');
			return true;
		}
		return false;
	};
})

.service('SocketService',function($http,$rootScope,$location){
	var SocketService=this;
	var socket;
	
	SocketService.initSocket = function(){
		if(! $rootScope.user){
			$location.path('/');
			return false;
		}
		socket = io.connect();
		socket.emit('socket-init',{user: $rootScope.user});
		
		SocketService.sendMessage = function(message){
			message.sentBy = $rootScope.user.username;
	
			socket.emit('message',message);
		};
		
		SocketService.loadPrevious = function(chatterUsername, topMessageSentAt){
			message.sentBy = $rootScope.user.username;
	
			socket.emit('loadPrevious',{
				username: [$rootScope.user.username,chatterUsername],
				time: topMessageSentAt
			});
		};

		SocketService.newMessage = function(callback){
			if(callback){
				socket.on('message',callback);
			}
		};
		
		SocketService.sendSearchRequest = function(searchField){
			socket.emit('search',{
				username: $rootScope.user.username, 
				searchField: searchField
			});
		}
		
		SocketService.getSearchList = function(callback){
			if(callback){
				socket.on('search',callback);
			}
		};
		
		SocketService.refreshStatus = function(usernames){
			socket.emit('refreshStatus',usernames);
		}
		
		SocketService.getStatus = function(callback){
			if(callback){
				socket.on('refreshStatus',callback);
			}
		};
		
		return true;
	};
})
