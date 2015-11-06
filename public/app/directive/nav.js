Core.add(function($) {
	"use strict";

	return (function(app) {
		app.Directive('jinxNav', ['$scope', '$rootScope', '$http', '$filter', '$timeout',  function($scope, $rootScope, $http, $filter, $timeout) {
			
			_this = {
				restrict: 'E',
				templateUrl: '/public/app/partials/nav.html',
				link: function(scope, element, attrs) {
					scope.tab = {
						list: tabs
					};
				}
			};
			return _this;
		}]);
	});
});