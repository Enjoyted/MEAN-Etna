isset = function(a) { return ((typeof(a) !== 'undefined' && a !== null) ? true : false); };
ucfirst = function(str) {
	str += '';
	var c = str.charAt(0).toUpperCase();
	return c + str.substr(1);
}

var Core;
(function($) {
	
	// lib to load
	var _cache = function(array) {
		for (var i in array) {
			array[i] = array[i] + '?v=' + $.Config.version;
		}
		return (array);
	}

	var partials = '/public/app/partials/';

	base.connection = function($http, c, a, p) {
		return $http({method: 'post', url: '/', data: {c: (isset(c)) ? c : 'home', a: (isset(a)) ? a : 'index', p: (isset(p)) ? p : ''}});
	};
	
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
							templateUrl: partials + 'home.html',
							controller: 'controller.Home'
						}).
						when('/articles', {
							templateUrl: partials + 'view/articles.html',
							controller: 'controller.Articles'
						}).
						when('/article/:id', {
							templateUrl: partials + 'view/article.html',
							controller: 'controller.Article'
						}).
						when('/edit/:id', {
							templateUrl: partials + 'view/edit.html',
							controller: 'controller.Edit'
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