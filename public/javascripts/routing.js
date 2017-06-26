angular.module('ChatApp')
.config(['$routeProvider','$locationProvider','$animateProvider',function($routeProvider,$locationProvider,$animateProvider){
	//$animateProvider.classNameFilter(/ng-animate-enabled/)
	
	$routeProvider
	.when('/',{
		templateUrl:'views/index',
		controller:'LoginCtrllr',
		resolve: {
			check: function(LoginService){
				LoginService.alreadySignedInCheck();
			}
		}
	})
	.when('/chat',{
		templateUrl:'views/chat',
		controller:'ChatCtrllr',
		resolve: {
			check: function($location, $rootScope){
				if(! $rootScope.user){
					$location.path('/');
				}
			}
		}
	})
	.otherwise({
		redirectTo:'/'
	});
	$locationProvider.hashPrefix('');
}]);

