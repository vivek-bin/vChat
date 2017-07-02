angular.module('ChatApp')
.directive('highlighttab', ['$location', function(location) {

    return {
        restrict: 'C',
        link: function($scope, $element, $attrs) {
            var elementPath = $attrs.href.substring(1);
            $scope.$location = location;
            $scope.$watch('$location.path()', function(locationPath) {
                (elementPath === locationPath) ? $element.addClass("current") : $element.removeClass("current");
            });
        }
    };
}]);