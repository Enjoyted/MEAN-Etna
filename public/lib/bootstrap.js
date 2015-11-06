
var Core;
(function($) {
	var _waitingrun = [];
	$.add = function(a) {
		_waitingrun.push(a);
	}
	
	var _base = function(name, module) {
		$.jQuery = jQuery;
		
		this._controller = angular.module('Controllers', []);
		this._directive = angular.module('Directive', []);
		this._service = angular.module('Service', []);
		module.push('Controllers');
		module.push('Directive');
		module.push('Service');
		
		this._name = name;
		this._app = angular.module(name, module);
		
		this._loaded = false;
		this._waiting = {files: false};
		this._event = new $.event();
	};
	_base.prototype = {
		_done: function(key) {
			if (this._loaded) {
				return (true);
			}
			
			if ($.defined(key)) {
				this._waiting[key] = true;
			}
			for (var i in this._waiting) {
				if (this._waiting[i] == false) {
					return (false);
				}
			}
			
			this._event.emit('loaded');
			return (true);
		},
		
		loaded: function() {
			var p = new $.promise();
			
			if (this._loaded) {
				p.resolve();
			} else {
				this._event.once('loaded', function() {
					p.resolve();
				});
			}
			
			return (p);
		},
		
		Load: function(appFiles, callback) {
			var self = this;
			
			$.require(appFiles, function() {
				for (var i in _waitingrun) {
					var func = _waitingrun[i]($);
					func(self);
				}
				callback();
				
				angular.element(document).ready(function() {
					angular.bootstrap(document, [self._name]);
				});
				self._done('files');
			});
			return (this);
		},
		Config: function(query) {
			return (this._app.config(query));
		}, 
		Controller: function(name, query) {
			return (this._controller.controller('controller.' + name, query));
		},
		Directive: function(name, query) {
			return (this._directive.directive(name, query));
		},
		Service: function(name, query) {
			return (this._service.factory('service.' + name, query));
		}
	}; // --
	
	var loadCss = function(url) {
		var link = document.createElement('link');
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = url;
		document.getElementsByTagName('head')[0].appendChild(link);
	};
	
	// load files
	$.Bootstrap = function(appName, modules, css, callback) {
		var _file = [], _module = [];
		for (var i in modules) {
			_module.push(i);
			_file.push(modules[i]);
		}
		for (var i in css) {
			loadCss(css[i]);
		}
		$.require(_file, function() {
			callback(new _base(appName, _module));
		});
	};
})(Core || (Core = {}));
