"use strict";

/*
	side note we need a object that does all the path formating so we can use custom rules
	like !base -> go into the base folder and look
	
	JUST CLEANER :D
*/

global.$ = {};

// extends the prototype of a object
global.$.defined = function(a) { return (typeof(a) !== 'undefined' && a !== null); }

// replace require with custom rules
global.$.module = (function() {
	var origin = require;
	
	return (function(path) {
		var sub = path.replace(new RegExp('^!'), '');
		if (path.indexOf('/') !== -1 && path === sub && sub[0] !== '.') {
			return (origin(appRoot + '/app' + sub));
		} else {
			return (origin(sub));
		}
	});
})();

global.$.extends = function(source, fields) {
	if (typeof(source) === 'string') {
		var sub = source.replace(new RegExp('^!'), '');
		var parent = $.module((sub !== source) ? '/engine/base/' + sub : sub);
	} else {
		var parent = source;
	}
	var Inherit = function() {};
	Inherit.prototype = parent.prototype; 
	var obj = new Inherit();
	
	for (var name in fields) {
		obj[name] = fields[name];
	}
	if (fields.toString !== Object.prototype.toString) {
		obj.toString = fields.toString;
	}
	return (obj);
}

/* No dependency */
global.$.config = new ($.module('/engine/core/lib/config.js'))();

var _enum = new ($.module('/engine/core/lib/enum.js'))();
global.$.enum = _enum.get();

global.$.file = new ($.module('/engine/core/lib/file.js'))();
global.$.promise = $.module('/engine/core/lib/promise.js');
global.$.all = (function() {
	var _step = function(data, type, obj, i) {
		obj.out[i] = data;
		obj.done += 1;
		obj[type] += 1;
		if (obj.done >= obj.max) {
			if (obj.reject === 0) {
				obj.p.resolve(obj.out);
			} else {
				obj.p.reject(obj.out);
			}
		}
	}
	
	var _block = function(array, i, handle) {
		array[i].then(function(data) {
			_step(data, 'resolve', handle, i);
		}, function(err) {
			_step(err, 'reject', handle, i);
		});
	}
	
	return (function(array) {
		var handle = {
			p: new $.promise(),
			done: 0,
			reject: 0,
			resolve: 0,
			out: [],
			max: array.length
		};
		
		if (array.length <= 0) {
			handle.p.resolve();
			return (handle.p);
		}
		
		for (var i in array) {
			if (array[i] instanceof $.promise) {
				_block(array, i , handle);
			} else {
				_step(array[i], 'resolve', handle, i);
			}
		}
		
		return (handle.p);
	});
})();
global.$.qAll = function(array, stop) {
	var p = new $.promise();
	stop = stop || false;
	
	if (array.length <= 0) {
		p.resolve();
		return (p);
	}

	var error = false, data = [];
	var run = function(i) {
		if (i >= array.length) {
			p[(error) ? 'reject' : 'resolve'](data);
			return;
		}
		
		if (typeof(array[i]) === 'function') {
			var _p = array[i]();
			if (_p instanceof $.promise) {			
				array[i]().then(function(res) {
					data.push(res);
					run(i + 1);
				}, function(err) {
					error = true;
					data.push(err);
					if (stop) {
						p.reject(data);
					} else {
						run(i + 1);
					}
				});
			} else {
				data.push(_p);
				run(i + 1);
			}
		} else {
			data.push(array[i]);
			run(i + 1);
		}
	}
	run(0);

	return (p);
}
/* --------------- */

global.$.translate = new ($.module('/engine/core/lib/translate.js'))();

var _c = {
	error: new ($.module('/engine/core/lib/console.js'))('error'),
	warning: new ($.module('/engine/core/lib/console.js'))('warning'),
	debug: new ($.module('/engine/core/lib/console.js'))('debug'),
	info: new ($.module('/engine/core/lib/console.js'))('info')
};
global.$.console = {
	error: function() {
		if (arguments.length !== 0) {
			for (var i in arguments) {
				_c.error.red(arguments[i]);
			}
			_c.error.print();
		} else {
			return (_c.error);
		}
	},
	warning: function() {
		if (arguments.length !== 0) {
			for (var i in arguments) {
				_c.warning.yellow(arguments[i]);
			}
			_c.warning.print();
		} else {
			return (_c.warning);
		}
	},
	debug: function() {
		if (arguments.length !== 0) {
			for (var i in arguments) {
				_c.debug.cyan(arguments[i]);
			}
			_c.debug.print();
		} else {
			return (_c.debug);
		}
	},
	info: function() {
		if (arguments.length !== 0) {
			for (var i in arguments) {
				_c.info.white(arguments[i]);
			}
			_c.info.print();
		} else {
			return (_c.info);
		}
	},
};

global.$.log = new ($.module('/engine/core/lib/logs.js'))();

global.$.obm = new ($.module('/engine/core/lib/obm.js'))();
