"use strict";

/*
	add a backup using cron to zip the database and save
	do every day add config to know how many max we keep
*/

var fs = $.module('fs'), spawn = $.module('child_process').spawn, os = $.module('os');
var installer = $.module('/engine/core/database/mongodb/installer.js');
	
var obj = function(callback) {
	var self = this;
	this._running = false;
	this._path = $.file.Path.DB + 'mongodb/binary/bin';
	
	installer().then(function() {
		return ($.file.createFolder($.file.Path.CACHE + 'db'));
	}).then(function() {
		return ($.file.exists($.file.Path.CACHE + 'db/mongod.lock'));
	}).then(function() {
		return ($.file.stat($.file.Path.CACHE + 'db/mongod.lock'));
	}, function() {
		return ((new $.promise()).resolve(null));
	}).then(function(stats) {
		if ($.defined(stats) && stats.size !== 0) {
			return (self.repair().then(function() {
				return (self.start());
			}));
		}
		return (self.start());
	}).then(function() {
		callback();
	});
}
obj.prototype = {
	repair: function() {
		var self = this, p = new $.promise();
		self.repair = spawn(self._path + '/mongod', ['--storageEngine=mmapv1', '--dbpath', $.file.Path.CACHE + 'db', '--repair']);
		this.repair.stdout.on('data', function (data) {
			$.log.add('info', 'mongodb repair output ' + data);
		});
		this.repair.stderr.on('data', function (data) {
			$.console.error().white('mongod :').red('error in mongod repair ', err).print();
			$.log.add('error', 'error in mongod ', err);
		});
		
		this.repair.on('exit', function(code, signal) {
			p.resolve();
		});
		
		return (p);
	},
	start: function() {
		var self = this, p = new $.promise(), loaded = false;
		this.child = spawn(self._path + '/mongod', ['--storageEngine=mmapv1', '--dbpath', $.file.Path.CACHE + 'db']);
		this.child.stdout.on('data', function (data) {
			$.log.add('info', 'mongodb output ' + data);
			if (!loaded) {
				loaded = true;
				self._running = true;
				$.console.info().white('mongod :').green('is running').print();
				setTimeout(function() { p.resolve(); }, 1000);
			} 
		});
		this.child.stderr.on('data', function (err) {
			$.log.add('error', 'error in mongod ', err.toString());
		});
		
		this.child.on('exit', function(code, signal) {
			self._running = false;
			$.log.add('info', 'mongodb exit ' + code + signal);
			if ($.defined(self._exitCallback)) {
				self._exitCallback();
			}
		});
		
		return (p);
	},
	close: function() {
		var p = new $.promise(), self = this;
		$.console.info().white('mongod :').yellow('shutting down.').print();
		if ($.defined(this.child)) {
			self._exitCallback = function() {
				self._exitCallback = null;
				setTimeout(function() {
					$.log.add('info', 'waited 1sec after mongodb has close to do next close step.');
					$.console.info().white('mongod :').green('has closed.').print(); p.resolve();
				}, 1000);
			};
			this.child.kill('SIGINT'); //send close does not kill it
		}
		if (!self._running) {
			$.console.info().white('mongod :').yellow('not running.').print();
			p.resolve();
		}
		
		return (p);
	},
}

module.exports = obj;
