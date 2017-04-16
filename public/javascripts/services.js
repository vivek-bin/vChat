angular.module('MyApp')
.service('LoginService',function($http,$location){
	var LoginService=this
	
})

.service('ChatService',function($http){
	var ChatService=this;
	
	ChatService.sendMessage=function(message){
		$http.post('/sendmessage',{'message' : message})
		.then(function(res){
			
		}
		,function(error){
			console.log('AJAX failed while sending');
		})
	}
	
})
