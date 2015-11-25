Core.add(function(base) {
	"use strict";

	return (function(app) {
		app.Controller('Article', ['$scope', '$rootScope', '$routeParams', '$http', '$filter', '$timeout',  function($scope, $rootScope, $routeParams, $http, $filter, $timeout) {
		
			$scope.data = {};	
			$scope.display = false;
			$scope.comment = {
				pseudo: '',
				message: '',
				note: '3'
			};

			$scope.submit = function() {
				if ($scope.comment.pseudo != '' && $scope.comment.message != '') {
					$scope.comment.date = new Date().getTime();
					base.connection($http, 'post', '/rest/comment/' + $routeParams.id, $scope.comment).then(function(response) {
						if (response.data.result.ok == 1) {
							document.location.reload(true);
						}
					});
				}
			};

			$scope.getData = function() {
				base.connection($http, 'get', '/rest/article/' + $routeParams.id).then(function(response) {
					$scope.data = response.data;
					$scope.data.article = response.data[0];
					base.connection($http, 'get', '/rest/comment/' + $routeParams.id).then(function(response) {
						$scope.data.article.comments = response.data;
						$scope.format();
					});
				});
			};
			$scope.getData();

			$scope.format = function() {
				var note = 0;
				$scope.data.article.popularity = 0;
				$scope.data.article.date = $filter('date')(new Date($scope.data.article.date), 'EEEE, d MMMM y - HH:mm');
				for (var i in $scope.data.article.comments) {
					note += $scope.data.article.comments[i].note;
					$scope.data.article.popularity++;
					$scope.data.article.comments[i].date = $filter('date')(new Date($scope.data.article.comments[i].date), 'EEEE, d MMMM y - HH:mm');
				}
				if ($scope.data.article.popularity > 0) {
					$scope.data.article.note = note / $scope.data.article.comments.length;
				} else {
					$scope.data.article.note = '-';
				}
			}

			$timeout(function() {
				$('.jinxloadPage').css('opacity', '1');
			}, 250);
		}]);
	});
});