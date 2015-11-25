/**
 * Created by teddy on 06/11/15 and edited by thomas on 25/11/2015.
 */
Core.add(function(base) {
    "use strict";

    return (function(app) {
        app.Controller('Login', ['$scope', '$rootScope', '$routeParams', '$http', '$filter', '$timeout',  function($scope, $rootScope, $routeParams, $http, $filter, $timeout) {

            $scope.data = {
                username: '',
                password: ''
            };

            $scope.connect = function(type) {
                if ($scope.username != '' && $scope.password != '') {
                    base.connection($http, 'post', '/' + type, $scope.data).then(function(response) {
                        if (response.error == false) {
                            // response.response;
                            document.location.assign('#/articles');
                        }
                    });
                }
            }

            $timeout(function() {
                $('.jinxloadPage').css('opacity', '1');
            }, 250);
        }]);
    });
});