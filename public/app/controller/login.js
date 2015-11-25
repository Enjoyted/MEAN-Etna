/**
 * Created by teddy on 06/11/15 and edited by thomas on 25/11/2015.
 */
Core.add(function(base) {
    "use strict";

    return (function(app) {
        app.Controller('Login', ['$scope', '$rootScope', '$routeParams', '$http', '$filter', '$timeout',  function($scope, $rootScope, $routeParams, $http, $filter, $timeout) {

            $scope.data = {
                username: '',
                password: '',
                error: ''
            };

            $scope.connect = function(type) {
                if ($scope.username != '' && $scope.password != '') {
                    base.connection($http, 'post', '/' + type, $scope.data).then(function(response) {
                        if (response.data.error == false) {
                            document.location.assign('#/articles');
                        } else {
                            $scope.data.error = response.data.message || response.data.response;
                        }
                    }, function(response) {
                        if (response.data.error == false) {
                            document.location.assign('#/articles');
                        } else {
                            $scope.data.error = response.data.message || response.data.response;
                        }
                    });
                }
            }

            $scope.logout = function(argument) {
                base.connection($http, 'post', '/logout').then(function(response) {
                    document.location.reload(true);
                });
            };

            $timeout(function() {
                $('.jinxloadPage').css('opacity', '1');
            }, 250);
        }]);
    });
});