"use strict";

/*
	everything will use this as it's base
	make extend work easly with this
*/
var crypto = $.module('crypto');

var obj = function() {}
obj.prototype = {
	_obm: null,
	obm: function() {
		return (this._obm);
	},
	randomKey: function(length) {
		var text = '', possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (var i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return (text);
	},
	hash: (function() {
		var config = null;
		
		return (function(data, salt) {
			if (!$.defined(config)) {
				config = $.config.get('crypto');
			}
			
			for (var i = 0; i < config.sub; i++) {
				var sub = crypto.createHash(config.type);
				sub.update(((i % 2 == 1) ? config.salt : salt) + data + ((i % 2 == 0) ? config.salt : salt));
				data = sub.digest('hex');
			}
			
			return (data);
		})
	})(),
	uniqueKey: (function() {
		var time = 0, storage = [];
		var has = function(key) {
			for (var i in storage) {
				if (key === storage[i]) {
					return (true);
				}
			}
			return (false);
		}
		
		var count = 0;
		return (function() {
			var cur = new Date().getTime();
			if (time !== cur) {
				time = cur;
				storage = [];
			}
			var key = this.randomKey(8);
			while (has(key)) {
				key = this.randomKey(8);
			}
			count += 1;
			return (cur + (count + '') + (process.pid + key));
		});
	})(),
	merge: function(a, b) {
		if ($.defined(b)) {
			for (var i in b) {
				a[i] = b[i];
			}
		}
		return (a);
	},
	copy: function(obj, m) {
		var out = (Array.isArray(obj)) ? [] : {};
		for (var i in obj) {
			if (typeof(obj[i]) === 'object' && obj[i] !== null) {
				out[i] = this.copy(obj[i]);
			} else {
				out[i] = obj[i];
			}
		}
		return (this.merge(out, m));
	},
	json: function(obj, type) {
		if (type) {
			var json = null;
			try {
				json = JSON.parse(obj);
			} catch (e) {
				console.log(e, e.stack);
			}
			return (json);
		}
		return (JSON.stringify(obj));
	},
	
}

module.exports = obj;
