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
	LoginService.alreadySignedInCheck = function(){
		$http.get('/users/success').then(function(res){
			LoginService.userAuthenticated(res.data.user);
		},function(err){
			console.log('error checking persistant sign in');
		});
	}
	LoginService.userAuthenticated = function(user){
		if(user){
			$rootScope.user=user;
			$location.path('/chat');
			return true;
		}
		return false;
	};
})

.service('SocketService',function($http,$rootScope,$location,$anchorScroll){
	var SocketService=this;
	var socket;
	
	SocketService.initSocket = function(){
		socket = io.connect();
		socket.emit('socket-init',{user: $rootScope.user});
		
		SocketService.sendMessage = function(message){
			message.sentBy = $rootScope.user.username;
	
			socket.emit('message',message);
		};
		
		SocketService.loadPrevious = function(chatterUsername, topMessageSentAt){
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
		
		SocketService.isLoggedInUser = function(username){
			if($rootScope.user.username === username){
				return true;
			}
			return false;
		};
	};
})

.service('ChatService',function($http,$window,$rootScope,$location,$timeout,$anchorScroll){
	var ChatService=this;
	
	ChatService.getTimeStamp = function(time){
		var newDate = new Date(time);
		var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var timeStamp = monthNames[newDate.getMonth()] + ' ' + newDate.getDate() + ', ' + newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds();
		return timeStamp;
	};
	
	ChatService.scrollToBottom = function(){
		$timeout(function(){
			$anchorScroll('chat-bottom')
		});
	};
	
	ChatService.signOut = function(){
		$http.get('/users/signout')
		.then(function(res){
			$rootScope.user=undefined;
			$location.path('/');
		},function(error){
			console.log('AJAX failed during signout');
		});
	};
})
