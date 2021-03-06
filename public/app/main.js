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

	$.connection = function($http, method, url, data) {
		return $http({method: (method ? method : 'post'), url: (url ? url : '/'), data: (data ? data : {})});
	};
	
	requirejs(_cache([
		'/lib/core.js',
		'/lib/bootstrap.js',
		'/lib/Jquery-2.1.4.js',
		'/lib/angular/angular.js',
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
				'/content/js/bootstrap.js',
				'/app/controller/articles.js',
				'/app/controller/article.js',
				'/app/controller/edit.js',
				'/app/controller/home.js',
                '/app/controller/login.js'
			]), function() {
				app.Config(['$routeProvider', function($routeProvider) {
					$routeProvider.
						when('/home', {
							templateUrl: partials + 'view/login.html',
							controller: 'controller.Login'
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
                        when('/login', {
                            templateUrl: partials + 'view/login.html',
                            controller: 'controller.Login'
                        }).
						otherwise({
							redirectTo: '/home'
						});		
				}]).run(['$cookies', '$rootScope', '$location', '$timeout', function($cookies, $rootScope, $location, $timeout) {
					app.loaded().then(function() {
						$.console.info('app loaded', app);
						$.jQuery('.loadingBlock').css({'pointer-events': 'none', 'opacity': 0});
					});
				}]);
			});
		});
	});
})(Core || (Core = {}));