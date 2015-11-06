"use strict";

var obj = function() {
	this._config = $.config.get('translate');
	this._lang = require(this._config.path + this._config.support[this._config.lang]);
};
obj.prototype = $.extends('!base', {
	get: function(code, data) {
		var str = this._lang[code] || code;
		if ($.defined(data)) {
			for (var i in data) {
				str = str.replace('{{' + i + '}}', data[i]);
			}
		}
		return (str);
	},
	build: function() {
		var out = {lang: {}, file: {}}, support = this._config.support;
		for (var i in support) {
			var fileName = (support[i]).replace('.js', ''); // fast way :/ 
			if (!$.defined(out.file[fileName])) {
				out.file[fileName] = require(this._config.path + support[i]);
			}
			out.lang[i] = fileName;
		}
		return (out);
	}
})

module.exports = obj;