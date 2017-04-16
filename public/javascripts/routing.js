angular.module('ChatApp')
.config(['$routeProvider','$locationProvider','$animateProvider',function($routeProvider,$locationProvider,$animateProvider){
	$animateProvider.classNameFilter(/ng-animate-enabled/)
	
	$routeProvider
	.when('/',{
		templateUrl:'/index',
		controller:'LoginCtrllr'
	})
	.when('/chat',{
		templateUrl:'/chat',
		controller:'ChatCtrllr'
	})
	.otherwise({
		redirectTo:'/'
	});
	$locationProvider.hashPrefix('');
}]);

