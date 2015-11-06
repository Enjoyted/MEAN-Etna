
var Core, isset;
(function($) {
	"use strict";
	
	$.extends = function(source, fields) {
		var Inherit = function() {};
		Inherit.prototype = source.prototype; 
		var obj = new Inherit();
		
		for (var name in fields) {
			obj[name] = fields[name];
		}
		if (fields.toString !== Object.prototype.toString) {
			obj.toString = fields.toString;
		}
		return (obj);
	}
	/*----------------- Base -------------------*/

	$.merge = function(a, b) {
		if ($.defined(b)) {
			for (var i in b) {
				a[i] = b[i];
			}
		}
		return (a);
	};
	
	$.copy = function(obj, m) {
		var out = (Array.isArray(obj)) ? [] : {};
		for (var i in obj) {
			if (typeof(obj[i]) === 'object' && obj[i] !== null) {
				out[i] = this.copy(obj[i]);
			} else {
				out[i] = obj[i];
			}
		}
		return (this.merge(out, m));
	};
	
	$.json = function(obj, type) {
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
	};

	
	var _base = function() {
		
	};
	_base.prototype = {
		
	};
	
	/*----------------- Log -------------------*/
	var _log = function(config) {
		this._config = config;
	};
	_log.prototype = $.extends(_base, {
		log: function() {
			if (this._config.log) {
				console.log.apply(console, arguments);
			}
		},
		debug: function() {
			if (this._config.debug) {
				console.debug.apply(console, arguments);
			}
		},
		error: function() {
			if (this._config.error) {
				console.error.apply(console, arguments);
			}
		},
		info: function() {
			if (this._config.info) {
				console.info.apply(console, arguments);
			}
		},
		warn: function() {
			if (this._config.warn) {
				console.warn.apply(console, arguments);
			}
		},
	});
	$.console = new _log($.Config.console)
	/*----------------- Log -------------------*/

	
	/*----------------- Base -------------------*/
	$.defined = function(a) { return (typeof(a) !== 'undefined' && a !== null); }
	// remove when you replace the old
	isset = $.defined;
	$.wait = (function() {
		var loaded = false;
		var cached = [];
		
		window.addEventListener("load", function() {
			for (var i in cached) {
				setTimeout(function() {
					cached[i].promise.resolve();
				}, cached[i].time);
			}
			loaded = true;
		}, false);
		
		return (function(c, t) {
			var p = new $.promise();
			if (loaded) {
				setTimeout(function () {
					p.resolve();
				}, t);
			} else {
				cached.push({promise: p, time: t});
			}
			return (p);
		});
	})();
	$.require = function(b, c) {
		var a = 0;
		var run = function() {
			if (a < b.length) {
				$.console.info('loading: ' + b[a])
				requirejs([b[a]], function() { a += 1; run(); });
			} else {
				c();
			}
		}
		run();
	};
	
	
	/*----------------- Promise -------------------*/
	var p = function() {
		this._back = 0;
		this._chain = [];
		this._parent = null;
		this._sync = {got: false, res: null, func: null};
		this._responce = false;
	}
	p.prototype = $.extends(_base, {
		_setParent: function(p) {
			this._parent = p;
			return (this);
		},
		_syncRun: function() {
			if (this._sync.got) {
				this._sync.got = false;
				this.__run(this._sync.res, this._sync.func);
			}
		},
		then: function(resolve, reject) {
			this._chain.push({callback: {resolve: resolve, reject: reject}, promise: this});
			this._syncRun();
			return (this);
		},
		__run: function(res, func) {
			if (this._parent == null) {
				if (this._back < this._chain.length) {
					var call = this._chain[this._back].callback[func], out = null;
					if (typeof(call) === 'function') { // TODO: make this into a function
						out = call(res);
					}
					
					if (typeof(out) !== 'undefined') {
						if (out instanceof p) {
							if ($.defined(this._chain[this._back])) { 
								this._chain[this._back].promise = out._setParent(this);
								this._back += 1;
								for (var i in out._chain) {
									var id = this._back + Number(i);
									this._chain.splice(id, 0, out._chain[i]);
									this._chain[id].promise = this._chain[id].promise._setParent(this);
								}
								out._chain = [];
								out._syncRun();
							} else {
								this._sync = {got: true, res: res, func: func};
								out._sync = {got: false, res: null, func: null};
							}
						} else {
							this._back += 1;
							this.__run(out, 'resolve');
							// maybe do something else??
						}
					}
				} else {
					this._sync.got = true;
					this._sync.res = res;
					this._sync.func = func;
				}
			} else {
				if (!this._responce) {
					this._responce = true;
					this._parent.__run(res, func);
				}
			}
		},
		resolve: function(res) {
			this.__run(res, 'resolve');
			return (this);
		},
		reject: function(res) {
			this.__run(res, 'reject');
			return (this);
		},
	});
	$.promise = p;
	
	$.all = (function() {
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
	$.qAll = function(array, stop) {
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
	/*----------------- Promise -------------------*/
	
	
	/*----------------- Event -------------------*/
	var trigger = function(event, callback, parent) {
		this._event = event;
		this._callback = callback;
		this._limit = null;
		this._parent = parent;
	};
	trigger.prototype = $.extends(_base, {
		remove: function() {
			var list = this._parent._eventList[this._event];
			for (var i in list) {
				if (list[i] === this) {
					list[i].splice(i, 1);
					return (true);
				}
			}
			return (false);
		},
		emit: function(data) {
			this._callback(data);
			if ($.defined(this._limit)) {
				this._limit += -1;
			}
		},
		setLimit: function(n) {
			this._limit = n;
		},
		hitLimit: function() {
			return ($.defined(this._limit) && this._limit <= 0);
		}
	});
	
	var _event = function() {
		this._eventList = {};
		this._max = 10;
		this._current = 0;
	};
	_event.prototype = $.extends(_base, {
		_overMax: function() {
			if ($.defined(this._max) && this._current > this._max) {
				var e = new Error('get');
				$.console.warn('Warrning: event listiner is at ', this._current, ' current triggers ', e.stack);
			}
		},
		
		on: function(event, callback) {
			this._overMax();
			if (!$.defined(this._eventList[event])) {
				this._eventList[event] = [];
			}
			this._eventList[event].push(new trigger(event, callback, this));
			return (this);
		},
		once: function(event, callback) {
			var a = new trigger(event, callback, this);
			a.setLimit(1);
			
			this._overMax();
			if (!$.defined(this._eventList[event])) {
				this._eventList[event] = [];
			}
			this._eventList[event].push(a);
			return (this);
		},
		emit: function(event, data) {
			for (var i in this._eventList[event]) {
				this._eventList[event][i].emit(data);
				if (this._eventList[event][i].hitLimit()) {
					this._eventList[event].splice(i, 1);
				}
			}
			return (this);
		},
		
		setMaxListeners: function(n) {
			this._max = n;
		},
		removeAllListeners: function(event) { // event
			this._eventList[event] = [];
		},
		listenerCount: function(event) {
			return (this._eventList[event].length)
		},
		removeListener: function(event, call) {
			for (var i in this._eventList[event]) {
				if (this._eventList[event][i]._callback === call) {
					this._eventList[event].splice(i, 1);
					return (true);
				}
			}
			return (false);
		}
	});
	$.event = _event;
	/*----------------- Event -------------------*/
	
})(Core || (Core = {}));