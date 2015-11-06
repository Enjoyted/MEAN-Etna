"use strict";

var obj = function() {
	this._config = $.config.get('enum');
	this._enum = require(this._config.file);
	this._formatType = {
		'underscore': function(i, str) {
			return (((i != 0) ? '_' : '') + str.toUpperCase());
		},
		'camelcase': function(i, str) {
			if (i != 0) {
				return (str.charAt(0).toUpperCase() + str.slice(1));
			} else {
				return (str);
			}
		},
	};
	
	this.map = this._map(this._enum);
};
obj.prototype = $.extends('!base', {
	_map: function(obj) {
		var map = {};
		for (var i in obj) {
			var base = this._format(i);
			map[this._format(base, this._config.map)] = (typeof(obj[i]) === 'object')? this._map(obj[i]) : obj[i];
		}
		return (map);
	},
	_format: function(data, into) {
		var out = '';
		if ($.defined(into)) {
			var base = data.split(' ');
			for (var i in base) {
				out += this._formatType[into](i, base[i]);
			}
		} else {
			var base = data.replace('_', ' ');
			for (var i = 0; i < base.length; i++) {
				var code = base.charCodeAt(i);
				out += ((code >= 65 && code <= 90) ? ' ' + (base[i]).toLowerCase() : '' + base[i]); 
			}
		}
		return (out);
	},
	
	get: function(key) {
		if ($.defined(key)) {
			return (this.map[key]);
		}
		return (this.map);
	}
})

module.exports = obj;