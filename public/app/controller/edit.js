Core.add(function(base) {
	"use strict";

	return (function(app) {
		app.Controller('Edit', ['$scope', '$rootScope', '$routeParams', '$http', '$q', '$filter', '$timeout',  function($scope, $rootScope, $routeParams, $http, $q, $filter, $timeout) {
			
			$scope.data = {};
			$scope.display = false;
			$scope.comment = {
				pseudo: '',
				message: '',
				note: '3'
			};

			$scope.submit = function() {
				if ($scope.data.article.nom != '' && 
					$scope.data.article.introduction != '' && 
					$scope.data.article.description != '' && 
					$scope.data.article.tags != '' &&  
					$scope.data.article.pseudo != '' && 
					$scope.data.article.email != '') {
					base.connection($http, 'put', '/rest/article/' + $routeParams.id, $scope.data.article).then(function(response) {
						if (response.data.result.ok == 1) {
							document.location.reload(true);

							/*if ($scope.comment.pseudo != '' && $scope.comment.message != '') {
								var data = $scope.comment;
								data.id_article = $routeParams.id;
								base.connection($http, 'post', '/rest/comment/' + $routeParams.id, data).then(function(response) {
									if (response.data.result.ok == 1) {
										document.location.reload(true);
									}
								});
							}*/

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
				base.connection($http, 'delete', '/rest/article/' + $routeParams.id).then(function(response) {
					if (response.data.ok == 1) {
						document.location.replace('#/articles');
					}
				});
			};

			base.connection($http, 'get', '/rest/article/' + $routeParams.id).then(function(response) {
				$scope.data = response.data;
				$scope.data.article = response.data[0];
				base.connection($http, 'get', '/rest/comment/' + $routeParams.id).then(function(response) {
					$scope.data.article.comments = response.data;
					$scope.format();
				});
			});

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