"use strict";

var obj = function(callback) {
	if ($.defined(this._modules[$.config.get('database.type')])) {
		this._modules[$.config.get('database.type')].init(this, callback);
	}
}
obj.prototype = $.extends('!base', {
	_modules: {
		mongodb: {
			init: function(self, callback) {
				var handle = $.module('/engine/core/database/mongodb/handle.js');
				self._handle = new handle(callback);
			},
			close: function(self) {
				var p = new $.promise();
				
				self._handle.close().then(function() {
					p.resolve();
				});
				
				return (p);
			}
		}
	},
	close: function() {
		var p = new $.promise();
		
		if ($.defined(this._modules[$.config.get('database.type')])) {
			this._modules[$.config.get('database.type')].close(this).then(function() {
				p.resolve();
			});
			return (p);
		}
		
		$.console.error().white('database :').yellow('close() called.').print();
		return (p.resolve());
	}	
});

module.exports = obj;