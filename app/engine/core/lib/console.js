"use strict";

var _key = 90; // 90 or 30
var _color = {
	black: '\x1b[' + (_key + 0) + 'm',
	red: '\x1b[' + (_key + 1) + 'm',
	green: '\x1b[' + (_key + 2) + 'm',
	yellow: '\x1b[' + (_key + 3) + 'm',
	blue: '\x1b[' + (_key + 4) + 'm',
	magenta: '\x1b[' + (_key + 5) + 'm',
	cyan: '\x1b[' + (_key + 6) + 'm',
	white: '\x1b[' + (_key + 7) + 'm',
}

var obj = function(type) {
	this._type = type;
	this._config = $.config.get('console');
	this._message = [];
}
obj.prototype = $.extends('!base', {
	_add: function(color, array) {
		for (var i in array) {
			this._message.push({color: color, msg: array[i]});
		}
		return (this);
	},
	_getColor: function(name) {
		if ($.defined(_color[name])) {
			return (_color[name]);
		}
		return (null);
	},
	_print: function(str) {
		if (this._config[this._type] === false) {
			return;
		}
		
		if ($.defined(str)) {
			return ([str]);
		} else {
			var out = [], currentColor = null, part = 0, msg = 0;
			for (var i in this._message) {
				if (!$.defined(out[part])) {
					out[part] = '';
				}
				if (currentColor !== this._message[i].color && this._message[i].color !== '_') {
					out[part] += this._getColor(this._message[i].color);
					currentColor = this._message[i].color
				}
				if (typeof(this._message[i].msg) !== 'string') {
					part += 2;
					out[part - 1] = this._message[i].msg;
					msg = 0;
				} else {
					out[part] += ((msg != 0) ? ' ' : '') + this._message[i].msg;
					msg += 1;
				}
			}
			out[part + ((typeof(this._message[i].msg) !== 'string') ? 0 : 1)] = '\x1b[0m';
			this.reset();
			return (out);
		}
	},
	reset: function() {
		this._message = [];
	},
	
	black: function() {
		return (this._add('black', arguments));
	},
	red: function() {
		return (this._add('red', arguments));
	},
	green: function() {
		return (this._add('green', arguments));
	},
	yellow: function() {
		return (this._add('yellow', arguments));
	},
	blue: function() {
		return (this._add('blue', arguments));
	},
	magenta: function() {
		return (this._add('magenta', arguments));
	},
	cyan: function() {
		return (this._add('cyan', arguments));
	},
	white: function() {
		return (this._add('white', arguments));
	},

	n: function() {
		return (this._add('_', ["\n"]));
	},
	print: function(str) {
		var msg = this._print(str);
		console.log.apply(null, msg);
	}
});

module.exports = obj;