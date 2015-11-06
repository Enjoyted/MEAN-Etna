Core.add(function(base) {
	"use strict";

	return (function(app) {
		app.Controller('Article', ['$scope', '$rootScope', '$http', '$filter', '$timeout',  function($scope, $rootScope, $http, $filter, $timeout) {
		
			$scope.data = {};	
			$scope.display = false;
			$scope.commentaire = {
				pseudo: '',
				message: '',
				note: '3'
			};

			$scope.submit = function() {
				if ($scope.commentaire.pseudo != '' && $scope.commentaire.message != '') {
					var data = $scope.commentaire;
					data.id_article = $routeParams.id;
					base.connection($http, 'post', '/rest/comment/', data).then(function(response) {
						if (response.data.result.ok == 1) {
							document.location.reload(true);
						}
					});
				}
			};

			base.connection($http, 'get', '/rest/article/' + $routeParams).then(function(response) {
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