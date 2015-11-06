Core.add(function($) {
	"use strict";

	return (function(app) {
		app.Controller('Home', ['$scope', '$rootScope', '$http', '$filter', '$timeout',  function($scope, $rootScope, $http, $filter, $timeout) {
			
			$scope.data = {};

			base.connection($http, 'home', 'index').then(function(response) {
				$scope.data = response.data;
			});

			$timeout(function() {
				$('.jinxloadPage').css('opacity', '1');
			}, 250);
		}]);
	});
});