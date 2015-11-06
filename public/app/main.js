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
			array[i] = array[i] + '?v=' + Math.floor(Math.random() * 10000);
		}
		return (array);
	}

	var partials = '/app/partials/';

	$.connection = function($http, c, a, p) {
		return $http({method: 'post', url: '/', data: {c: (isset(c)) ? c : 'home', a: (isset(a)) ? a : 'index', p: (isset(p)) ? p : ''}});
	};
	
	requirejs(_cache([
		'/lib/Jquery-2.1.4.js',
		'/content/js/bootstrap.js'
	]), function(util) {
		$.Bootstrap('fuck this', _cache({
			ngRoute: '/lib/angular/angular-route.min.js',
			ngCookies: '/lib/angular/angular-cookies.min.js',
			ngAnimate: '/lib/angular/angular-animate.min.js',
		}), _cache([
			'/content/css/bootstrap.css',
			'/content/css/font-awesome.css',
			'/content/css/app.css'
		]), function(app) {
			
			app.Load(_cache([
				'/content/build/app.min.js'
			]), function() {
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