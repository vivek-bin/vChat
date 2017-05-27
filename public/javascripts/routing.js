angular.module('ChatApp')
.config(['$routeProvider','$locationProvider','$animateProvider',function($routeProvider,$locationProvider,$animateProvider){
	//$animateProvider.classNameFilter(/ng-animate-enabled/)
	
	$routeProvider
	.when('/',{
		templateUrl:'/',
		controller:'LoginCtrllr'
	})
	.when('/chat',{
		templateUrl:'/api/chat',
		controller:'ChatCtrllr'
	})
	.otherwise({
		redirectTo:'/'
	});
	$locationProvider.hashPrefix('');
}]);

