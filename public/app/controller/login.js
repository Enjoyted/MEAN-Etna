/**
 * Created by teddy on 06/11/15.
 */
Core.add(function(base) {
    "use strict";

    return (function(app) {
        app.Controller('Login', ['$scope', '$rootScope', '$http', '$filter', '$timeout',  function($scope, $rootScope, $http, $filter, $timeout) {

			$scope.auth = {
				data: {
					login: '',
					password: ''
				},
				login: function() {
                    base.connection($http, 'post', '/login/', this.data).then(function(response) {
                        console.log(response);
                    });
				},
				register: function() {
                    base.connection($http, 'post', '/register/', this.data).then(function(response) {
                        console.log(response);
                    });
				}
			}
		
            $timeout(function() {
                $('.jinxloadPage').css('opacity', '1');
            }, 250);

        }]);
    });
});