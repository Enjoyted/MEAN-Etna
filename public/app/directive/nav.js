Core.add(function(base) {
	"use strict";

	var tabs = [
		{name:'Home', url:'/home', icon:'fa fa-home'},
		{name:'Articles', url:'/articles', icon:'fa fa-list'}
	];

	return (function(app) {
		app.Directive('jinxNav', ['$scope', '$rootScope', '$http', '$filter', '$timeout',  function($scope, $rootScope, $http, $filter, $timeout) {
			_this = {
				restrict: 'E',
				templateUrl: '/app/partials/nav.html',
				link: function(scope, element, attrs) {
					scope.tab = {
						list: tabs
					};
					$.console.info('app loaded');
				}
			};
			return _this;
		}]);
	});
});