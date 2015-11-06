Core.add(function($) {
	"use strict";
	
	/*
		this does not work
	*/
	$.ws.on('/player/update/name').then(function(p) {
		console.log(p);
	});
	$.ws.on('/user/connected').then(function(p) {
		console.log(p);
	});	
	
	
	return (function(app) {
		app.Controller('Home', ['$scope', '$rootScope', '$timeout',  function($scope, $rootScope, $timeout) {
			$.merge($scope, {Translate: $rootScope.translate, Text: function(t, d) { return ($rootScope.translate.get(t, d)); }});
			
			$scope.home = {
				_run: false,
				_loop: function() {
					var self = this;
					if (!self._run) {
						return;
					}
					$timeout(function() {
						$.ws.send('/player/5/setname', {
							name: 'cat',
						});
						self._loop();
					}, 100);
				},
				sendMsg: function() {
					this._run = !this._run;
					console.log('click', this._run);
					
					$.ws.send('/user/register', {
						user: 'cat',
						password: 'cat'
					}); 
						
					this._loop();
				},
				_changeLang: true,
				setLang: function() {
					$scope.Translate.set(((this._changeLang = !this._changeLang)) ? 'FR' : 'EN_US');
				}
			};
			
			$.jQuery('.jinxFaidIn').css({'opacity': 1});
			$timeout(function() {
				$.jQuery('#Dragdown').css({'margin-top': '5%'});
			}, 250);
		}]);
	});	
});