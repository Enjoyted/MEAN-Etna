var Core;
(function($) {
	
	// lib to load
	var _cache = function(array) {
		for (var i in array) {
			array[i] = array[i] + '?v=' + $.Config.version;
		}
		return (array);
	}
	
	requirejs(_cache(['/content/build/lib.min.js']), function(util) {
		$.Bootstrap($.Config.appName, _cache({
			ngRoute: '/lib/angular/angular-route.min.js',
			ngCookies: '/lib/angular/angular-cookies.min.js',
			ngAnimate: '/lib/angular/angular-animate.min.js',
		}), _cache(['/content/build/app.min.css']), function(app) {
			
			app.Load(_cache(['/content/build/app.min.js']), function() {
				app.Config(['$routeProvider', function($routeProvider) {
					$routeProvider.
						when('/home', {
							templateUrl: '/app/partials/home.html',
							controller: 'controller.Home'
						}).
						otherwise({
							redirectTo: '/home'
						});
					
				}]).run(['$cookies', '$rootScope', '$location', '$timeout', 'service.translate', function($cookies, $rootScope, $location, $timeout, translate) {
					$rootScope.translate = translate;
					app.loaded().then(function() {
						$.console.info('app loaded');
						$.jQuery('.loadingBlock').css({'pointer-events': 'none', 'opacity': 0});
					});
				}]);
			});
		});
	});
})(Core || (Core = {}));