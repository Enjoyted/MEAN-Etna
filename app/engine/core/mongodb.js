"use strict";

/*
	can be clean up and added to
*/
var events = $.module('events'), mongodb = $.module('/engine/node_modules/mongodb');

var obj = function(callback) {
	this._collection = 'default'; // can config
	if (typeof(callback) === 'function') {
		this.open().then(function () {
			callback();
		});
	}
	this._exit = false;
};
obj.prototype = $.extends('!base', {
	_event: new events.EventEmitter,
	_stack: {},
	open: function() {
		var p = new $.promise();

		if (this._stack._open) {
			p.resolve();
			return (p);
		} else {
			this._event.once('open', function() {
				p.resolve();
			});
			return (p);
		}
	},
	DB: function() {
		return this._stack.handle.collection(this._collection);
	},
	connect: function(url) {
		var self = this, p = new $.promise();
		this._stack.url = url;

		mongodb.MongoClient.connect(this._stack.url, function(err, db) {
			if (err) {
				return (self.connect(self._stack.url));
			} else {
				db.on('close', function() {
					if (!self._exit) {
						self._stack._open = false;
						self.connect(self._stack.url).then(function() {
							self._stack._open = true;
							self._event.emit('open');
						});
					}
				});

				self._stack.handle = db;
				self._stack._open = true;
				self._event.emit('open');
				p.resolve(self._stack.handle);
			}
		});

		return (p);
	},
	insert: function(array) {
		var p = new $.promise(), self = this;

		this.open().then(function() {
			var db = self._stack.handle.collection(self._collection),  opt = 'insertOne';

			if (Array.isArray(array)) {
				if (array.length >= 2) {
					opt = 'insertMany';
				} else {
					array = array[0];
				}
			}

			if ($.defined(array)) {
				db[opt](array, function (err, res) {
					if (err) {
						p.reject(err);
					} else {
						p.resolve({
							result: res.result,
							inserted: res.ops,
							count: res.insertedCount,
							id: res.insertedId
						});
					}
				});
			} else {
				p.resolve({result: null, inserted: [], count: 0, id: null});
			}
		});

		return (p);
	},
	update: function(find, set) {
		var p = new $.promise(), self = this;

		this.open().then(function() {
			var db = self._stack.handle.collection(self._collection);

			db.updateOne(find, set, function(err, result) {
				if (err) {
					p.reject(err);
				} else {
					p.resolve(result.result);
				}
			});
		});

		return (p);
	},
	updateMany: function(find, set) {
		var p = new $.promise(), self = this;

		this.open().then(function() {
			var db = self._stack.handle.collection(self._collection);

			db.updateMany(find, set, function(err, result) {
				if (err) {
					p.reject(err);
				} else {
					p.resolve(result.result);
				}
			});
		});

		return (p);
	},
	remove: function(find) {
		var p = new $.promise(), self = this;

		this.open().then(function() {
			var db = self._stack.handle.collection(self._collection);

			db.deleteOne(find, function(err, result) {
				if (err) {
					p.reject(err);
				} else {
					p.resolve(result.result);
				}
			});
		});

		return (p);
	},
	removeMany: function(find) {
		var p = new $.promise(), self = this;

		this.open().then(function() {
			var db = self._stack.handle.collection(self._collection);

			db.deleteMany(find, function(err, result) {
				if (err) {
					p.reject(err);
				} else {
					p.resolve(result.result);
				}
			});
		});

		return (p);
	},
	find: function(find, option) {
		var p = new $.promise(), self = this;

		this.open().then(function() {
			var db = self._stack.handle.collection(self._collection), q = db.find(find);

			if ($.defined(option)) {
				if ($.defined(option.sort)) {
					q.sort(option.sort);
				}
				if ($.defined(option.limit)) {
					q.limit(option.limit);
				}
			}

			q.toArray(function(err, result) {
				if (err) {
					p.reject(err);
				} else {
					p.resolve(result);
				}
			});
		});

		return (p);
	},
	close: function() {
		var p = new $.promise()
		this._stack.handle.on('close', function() {
			p.resolve();
		});
		this._exit = true;
		this._stack.handle.close();
		return (p);
	},
    ObjectId: function(str) {
        return (mongodb.ObjectId((str.length === 24) ? str : '000000000000000000000000'))
    }
});
module.exports = obj;