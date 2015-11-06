/**
 * Created by teddy on 06/11/15.
 */
Core.add(function(base) {
    "use strict";

    return (function(app) {
        app.Controller('Login', ['$scope', '$rootScope', '$http', '$filter', '$timeout',  function($scope, $rootScope, $http, $filter, $timeout) {

            $timeout(function() {
                $('.jinxloadPage').css('opacity', '1');
            }, 250);

        }]);
    });
});