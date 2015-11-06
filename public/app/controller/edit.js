Core.add(function(base) {
	"use strict";

	return (function(app) {
		app.Controller('Edit', ['$scope', '$rootScope', '$routeParams', '$http', '$filter', '$timeout',  function($scope, $rootScope, $routeParams, $http, $filter, $timeout) {
			
			$scope.data = {};
			$scope.display = false;
			$scope.commentaire = {
				pseudo: '',
				message: '',
				note: '3'
			};

			$scope.submit = function() {
				if ($scope.data.article.nom != '' && 
					$scope.data.article.introduction != '' && 
					$scope.data.article.description != '' && 
					$scope.data.article.tags != '' && 
					$scope.data.article.image != '' && 
					$scope.data.article.pseudo != '' && 
					$scope.data.article.email != '') {
					base.connection($http, 'put', '/rest/article/' + $scope.data.article._id, $scope.data.article).then(function(response) {
						if (response.data.result.ok == 1) {
							document.location.reload(true);
						}
					});
				}
			};

			$scope.active = function() {
				$scope.data.article.status = '1';
				$scope.submit();
			};

			$scope.deactive = function() {
				$scope.data.article.status = '0';
				$scope.submit();
			};

			$scope.delete = function() {
				base.connection($http, 'delete', '/rest/article/' + $scope.data.article._id).then(function(response) {
					if (response.data.ok == 1) {
						document.location.replace('#/articles');
					}
				});
			};

			base.connection($http, 'get', '/rest/article/' + $routeParams.id).then(function(response) {
				$scope.data = response.data;
				$scope.data.article = response.data[0];
				$scope.format();
			});

			$scope.format = function() {
				var note = 0;
				$scope.data.article.popularity = 0;
				$scope.data.article.date = $filter('date')(new Date($scope.data.article.date), 'EEEE, d MMMM y - HH:mm');
				for (var i in $scope.data.article.commentaires) {
					note += $scope.data.article.commentaires[i].note;
					$scope.data.article.popularity++;
					$scope.data.article.commentaires[i].date = $filter('date')(new Date($scope.data.article.commentaires[i].date), 'EEEE, d MMMM y - HH:mm');
				}
				if ($scope.data.article.popularity > 0) {
					$scope.data.article.note = note / $scope.data.article.commentaires.length;
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