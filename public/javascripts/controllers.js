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
	
	$scope.login=function(){
		
		
	};
	
	$scope.register=function(){
		if($scope.newUser.usn.length<3){
			return $scope.newUser.err="Username too short";
		}
		if($scope.newUser.pwd.length<6){
			return $scope.newUser.err="Password too short";
		}
		if($scope.newUser.pwd!==$scope.newUser.pwd2){
			return $scope.newUser.err="Passwords not same";
		}
		LoginService.register($scope.newUser.usn, $scope.newUser.pwd);
		
	};
})

.controller('ChatCtrllr',function($scope,LoginService,ChatService){
	var message={
		text: "",
		sentAt: ""
	};
	var chat={
		chatterId: "",
		chatterName: "",
		newMessageFlag: false,
		messages: []
	};
	
	$scope.currentChatterId = "";
	
	$scope.chats=[];
	
	ChatService.getChatData()
	.then(function(data){
		$scope.chats=data
	}
	,function(error){
		console.log('AJAX failed getting chats');
	})

})
