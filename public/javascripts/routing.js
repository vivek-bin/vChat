angular.module('ChatApp')
.config(['$routeProvider','$locationProvider','$animateProvider',function($routeProvider,$locationProvider,$animateProvider){
	//$animateProvider.classNameFilter(/ng-animate-enabled/)
	
	$routeProvider
	.when('/',{
		templateUrl:'views/index',
		controller:'LoginCtrllr'
	})
	.when('/chat',{
		templateUrl:'views/chat',
		controller:'ChatCtrllr'
	})
	.otherwise({
		redirectTo:'/'
	});
	$locationProvider.hashPrefix('');
}]);

