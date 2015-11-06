"use strict";

var obj = function() {}
obj.prototype = $.extends('!base', {
	get: function(path) {
		if ($.defined(path)) {
			return (($.defined(this._obm[path])) ? this._obm[path] : null );
		}
		return (this._obm);
	},
	add: function(path, data) {
		if ($.defined(this._obm[path])) {
			$.console.error('obm object "' + path + '" is overwriting duplicated path.');
		}
		this._obm[path] = data;
		return (this);
	},
	close: function(path) {
		var obj = this.get(path);
		return (($.defined(obj) && typeof(obj.close) === 'function')? obj.close() : null);
	}
})

module.exports = obj;