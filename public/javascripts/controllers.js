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

.controller('ChatCtrllr',function($scope,$timeout,SocketService){
	if(! SocketService.initSocket()){
		return this;
	}
	
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
	
	var getTimeStamp = function(time){
		var newDate = new Date(time);
		var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var timeStamp = monthNames[newDate.getMonth()] + ' ' + newDate.getDate() + ', ' + newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds();
		return timeStamp;
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
		if(username === $scope.currentChatId){$scope.currentChatId = "";}
		delete $scope.chats[username];
	};
	
	$scope.sendMessage = function(){
		if($scope.inputMessage === "" || $scope.currentChatId === ""){
			$scope.inputMessage = "";
			return;
		}
		var chatMessage = {
			message: $scope.inputMessage,
			sentTo: $scope.currentChatId,
			sentAt: new Date().getTime()
		};
		$scope.inputMessage = "";
		$scope.chats[chatMessage.sentTo].messages.push({
			messageText: chatMessage.message,
			sentAt: {
					globalTime: chatMessage.sentAt,
					localTimeStamp: getTimeStamp(chatMessage.sentAt)
				},
			sentByUser: true
		});
		SocketService.sendMessage(chatMessage);
	};

	SocketService.newMessage(function(data){
		for(var i =0; i<data.length;i++){
			var newMsg = {
				messageText: data[i].messageText,
				sentAt: {
						globalTime: data[i].sentAt,
						localTimeStamp: getTimeStamp(data[i].sentAt)
					},
				sentByUser: false
			}
			var id = data[i].sentBy;
			if(SocketService.isLoggedInUser(id)){	//check for loading prev messages by current user
				id = data[i].sentTo;
				newMsg.sentByUser = true;
			}
			createChat(id);
			if(id!= $scope.currentChatId){
				$scope.chats[id].messageWaiting = true;
			}
			
			if ($scope.chats[id].messages[0] && (new Date($scope.chats[id].messages[0].sentAt.globalTime).getTime() > new Date(newMsg.sentAt.globalTime).getTime())){
				$scope.chats[id].messages.unshift(newMsg);
			}
			else{
				$scope.chats[id].messages.push(newMsg);
			}
		}
		$timeout();
	});

	$scope.loadPrevious = function(){
		var id = $scope.currentChatId;
		var time = Date.now();
		if($scope.chats[id].messages && $scope.chats[id].messages[0]){
			time = $scope.chats[id].messages[0].sentAt.globalTime;
		}
		if(id){
			SocketService.loadPrevious(id,time);
		}
		
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
			},1000);
			SocketService.sendSearchRequest($scope.search.field);
		}
	};
	SocketService.getSearchList(function(data){
		$scope.search.nameList = data;
		$timeout();
	});
	
	var refreshStatus = function(){
		var usernames=[];
		for(var id in $scope.chats){
			if(!$scope.chats.hasOwnProperty(id)){
				continue;
			}
			usernames.push(id);
		}
		SocketService.refreshStatus(usernames);
		
		setTimeout(refreshStatus,2*60*1000);
	}
	setTimeout(refreshStatus,5*60*1000);
	
	SocketService.getStatus(function(data){
		for(var id in data){
			if(!data.hasOwnProperty(id)){
				continue;
			}
			$scope.chats[id].status = data[id];
		}
		$timeout();
	});
	
})
