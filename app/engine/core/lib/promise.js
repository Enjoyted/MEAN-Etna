"use strict";

var obj = function() {
	this._back = 0;
	this._chain = [];
	this._parent = null;
	this._sync = {got: false, res: null, func: null};
	this._responce = false;
}
obj.prototype = {
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
					if (out instanceof obj) {
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
}

module.exports = obj;