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

.controller('ChatCtrllr',function($scope,ChatService,SocketService){
	$scope.searchedNameList = {};
	$scope.searchField = "";
	var searchAvailable = true;
	$scope.searchNames = function(){
		if(!searchAvailable){
			return;
		}
		searchAvailable = false;
		
		setTimeout(function(){
			searchAvailable = true;
		},1500);
		console.log('getting names list')
		ChatService.getNameList($scope.searchField)
		.then(function(data){
			$scope.searchedNameList = data.users;
		},function(err){
			console.log("error getting names list")
		});
	};
	
	var currentChatId = "";
	$scope.chats=[];
	
	$scope.sendMessage = function(message){
		var chatMessage = {
			message: message,
			sentTo: currentChatId,
			sentAt: new Date()
		};
		$scope.chats[chatMessage.sentTo].messages.push({
			text: chatMessage.message,
			sentAt: chatMessage.sentAt,
			recievedMsg: false
		});
		SocketService.sendMessage(chatMessage);
	};
	
	SocketService.newMessage(function(data){
		$scope.chats[data.sentBy].messages.push({
			text: data.text,
			sentAt: data.sentAt,
			recievedMsg: true
		});
	});
	
})
