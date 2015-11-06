"use strict";

var obj = function() {
	this._config = require(appRoot + '/app/config.js');
}
obj.prototype = $.extends('!base', {
	get: function(path) {
		var key = path.split('.'), tmp = this._config;
		for (var i in key) {
			if (!$.defined(tmp[key[i]])) {
				return (null);
			}
			tmp = tmp[key[i]];
		}
		return (tmp);
	}
})

module.exports = obj;