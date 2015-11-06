Core.add(function($) {
	"use strict";

	return (function(app) {
		app.Controller('Articles', ['$scope', '$rootScope', '$http', '$filter', '$timeout',  function($scope, $rootScope, $http, $filter, $timeout) {

			$scope.data = {};
			$scope.search = '';
			$scope.mode = 'dateDesc';
			$scope.display = false;
			$scope.article = {
				nom: '',
				introduction: '',
				description: '',$
				tags: '',
				image: '',
				pseudo: '',
				email: '',
			};

			$scope.submit = function() {
				if ($scope.article.nom != '' && 
					$scope.article.introduction != '' && 
					$scope.article.description != '' && 
					$scope.article.tags != '' && 
					$scope.article.image != '' && 
					$scope.article.pseudo != '' && 
					$scope.article.email != '') {
					base.connection($http, 'articles', 'save', {article: $scope.article}).then(function(response) {
						if (response.data.state == 1) {
							document.location.assign('#/article/' + response.data.data.id);
						}
					});
				}
			};

			base.connection($http, 'articles', 'getList').then(function(response) {
				$scope.data = response.data.data;
				if (response.data.state == 1) {
					$scope.format();
				}
			});

			$scope.format = function() {
				for (var i in $scope.data) {
					var note = 0;
					$scope.data[i].popularity = 0;
					$scope.data[i].date = $filter('date')(new Date($scope.data[i].date), 'EEEE, d MMMM y - HH:mm');
					for (var c in $scope.data[i].commentaires) {
						note += $scope.data[i].commentaires[c].note;
						$scope.data[i].popularity++;
						$scope.data[i].commentaires[c].date = $filter('date')(new Date($scope.data[i].commentaires[c].date), 'EEEE, d MMMM y - HH:mm');
					}
					if ($scope.data[i].popularity > 0) {
						$scope.data[i].note = note / $scope.data[i].commentaires.length;
					} else {
						$scope.data[i].note = '-';
					}
				}
			}

			$scope.sort = function(param, mode) {
				var sort = true;
				if (mode == 'asc') {
					sort = false;
				}
				$scope.data = $filter('orderBy')($scope.data, param, sort);
				$scope.mode = param + ucfirst(mode);
			};

			$timeout(function() {
				$('.jinxloadPage').css('opacity', '1');
			}, 250);
		}]);
	});
});