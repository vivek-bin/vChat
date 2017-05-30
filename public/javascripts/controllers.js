angular.module('ChatApp')
.controller('LoginCtrllr',function($scope,LoginService){
	$scope.existingUser={
		usn: "",
		pwd: "",
		err: ""
	};
	$scope.newUser={
		usn: "",
		pwd: "",
		pwd2: "",
		err: ""
	};
	
	$scope.signIn=function(){
		LoginService.signIn({username: $scope.existingUser.usn, password: $scope.existingUser.pwd})
		.then(function(res){
			if(res.data.message){
				$scope.existingUser.err = res.data.message;
			}
			LoginService.userAuthenticated(res.data.user);
		},function(error){
			console.log('AJAX failed during signin');
		});
	};
	
	$scope.signOut=function(){
		LoginService.signOut();
	};
	
	$scope.signUp=function(){
		if($scope.newUser.usn.length<3){
			return $scope.newUser.err="Username too short";
		}
		if($scope.newUser.pwd.length<6){
			return $scope.newUser.err="Password too short";
		}
		if($scope.newUser.pwd!==$scope.newUser.pwd2){
			return $scope.newUser.err="Passwords not same";
		}
		LoginService.signUp({username: $scope.newUser.usn, password: $scope.newUser.pwd})
		.then(function(res){
			if(res.data.message){
				$scope.newUser.err = res.data.message;
			}
			LoginService.userAuthenticated(res.data.user);
		},function(error){
			console.log('AJAX failed during signup');
		});
	};
})

.controller('ChatCtrllr',function($scope,$timeout,ChatService,SocketService){
	var createChat = function(username){
		if($scope.chats[username]){
			return false;
		}
		$scope.chats[username]={
			messages: [],
			status: 0, 
			messageWaiting: false
		};
		return true;
	};
	
	if(SocketService.initSocket()){
		$scope.sendMessage = function(){
			if($scope.inputMessage === ""){return;}
			var chatMessage = {
				message: $scope.inputMessage,
				sentTo: $scope.currentChatId,
				sentAt: new Date()
			};
			$scope.chats[chatMessage.sentTo].messages.push({
				messageText: chatMessage.message,
				sentAt: chatMessage.sentAt,
				sentByUser: true
			});
			$scope.inputMessage = "";
			SocketService.sendMessage(chatMessage);
		};
	
		SocketService.newMessage(function(data){
			createChat(data.sentBy);
			if(data.sentBy != $scope.currentChatId){
				$scope.chats[data.sentBy].messageWaiting = true;
			}
			$scope.chats[data.sentBy].messages.push({
				messageText: data.message,
				sentAt: data.sentAt,
				sentByUser: false
			});
			$timeout();
		});
	}
	
	var searchAvailable = true;
	$scope.search = {
		nameList: {},
		field: "",
		searchNames: function(){
			if(!searchAvailable){
				return;
			}
			if($scope.search.field.length < 2){
				$scope.search.nameList=[];
				return;
			}
			searchAvailable = false;
		
			setTimeout(function(){
				searchAvailable = true;
			},1500);
		
			ChatService.getNameList($scope.search.field)
			.then(function(res){
				$scope.search.nameList = res.data.users;
			},function(err){
				console.log("error getting names list")
			});
		}
	};
	
	$scope.inputMessage = "";
	$scope.currentChatId = "";
	$scope.chats = {};
	
	$scope.switchChat = function(username){
		$scope.currentChatId = username;
		$scope.chats[username].messageWaiting = false;
	};
	
	$scope.newChat = function(username){
		createChat(username);
		$scope.switchChat(username);
		$scope.search.nameList = [];
		$scope.search.field = "";
	};
	
	$scope.closeChat = function(username){
		delete $scope.chats[username];
	};
	
})
