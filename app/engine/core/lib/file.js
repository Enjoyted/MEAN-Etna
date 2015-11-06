"use strict";

var fs = $.module('fs'), http = $.module('http');

var obj = function() {
	
};
obj.prototype = $.extends('!base', {
	Path: (function() {
		var data = {}
		for (var i in $.enum.PATH) {
			data[i] = $.enum.PATH[i];
		}
		data.LOG = $.config.get('log.path');
		return (data);
	})(),
	rename: function(a, b) {
		var p = new $.promise();
		
		fs.rename(a, b, function(err) {
			if (err)  {
				p.reject(err);
			} else {
				p.resolve({oldPath: a, newPath: b});
			}
		});
		
		return (p);
	},
	createFolder: function(path) {
		var self = this, p = new $.promise();
		
		return (self.exists(path).then(function() {
			return (p.resolve());
		}, function() {
			return (self.mkdir(path, '0744'));
		}));
	},
	remove: function(path) {
		var self = this, p = new $.promise(), directory = false;
		
		self.exists(path).then(function() {
			return (self.stat(path));
		}, function() {
			p.resolve();
		}).then(function(res) {
			if (res.stats.isDirectory()) {
				directory = true;
				return (self.readdir(res.path));
			} else {
				self.unlink(res.path);
				p.resolve();
			}
		}).then(function(res) {
			var wait = [];
			for (var i in res.files) {
				wait.push(self.stat(path + "/" + res.files[i]).then(function(res) {
					if (res.stats.isDirectory()) {
						return (self.remove(res.path));
					} else {
						return (self.unlink(res.path))
					}
				}));
			}
			return ($.all(wait));
		}).then(function() {
			if (directory) {
				return (self.unlinkDir(path));
			} else {
				var skip = new $.promise();
				return (skip.resolve());
			}
		}).then(function() {
			p.resolve();
		});
		
		return (p);
	},
	exists: function(path) {
		var p = new $.promise();
		
		fs.exists(path, function(exists) {
			if (!exists)  {
				p.reject(path);
			} else {
				p.resolve(path);
			}
		});
		
		return (p);
	},
	stat: function(path) {
		var p = new $.promise();
		
		fs.stat(path, function(err, stats) {
			if (err)  {
				p.reject(err);
			} else {
				p.resolve({path: path, stats: stats});
			}
		});
		
		return (p);
	},
	unlink: function(path) {
		var p = new $.promise();
		
		fs.unlink(path, function(err) {
			if (err)  {
				p.reject(err);
			} else {
				p.resolve();
			}
		});
		
		return (p);
	},
	unlinkDir: function(path) {
		var p = new $.promise();
		
		fs.rmdir(path, function(err) {
			if (err)  {
				p.reject(err);
			} else {
				p.resolve();
			}
		});
		
		return (p);
	},
	mkdir: function(path, mode) {
		var p = new $.promise();
		
		fs.mkdir(path, mode, function(err) {
			if (err)  {
				p.reject(err);
			} else {
				p.resolve(path);
			}
		});
		
		return (p);
	},
	readFile: function(path) {
		var p = new $.promise();
		
		fs.readFile(path, function(err, data) {
			if (err)  {
				p.reject(err);
			} else {
				p.resolve(data);
			}
		});
		
		return (p);
	},
	readdir: function(path) { // not camelcase FIX 
		var p = new $.promise();
		
		fs.readdir(path, function(err, files) {
			if (err)  {
				p.reject(err);
			} else {
				p.resolve({path: path, files: files});
			}
		});
		
		return (p);
	},
	download: function(path, url) {
		var p = new $.promise(), file = fs.createWriteStream(path);
		var request = http.get(url, function(res) {
			res.on('data', function(d) {
				file.write(d);
			});
			res.on('end', function() {
				p.resolve();
			});
			res.on('error', function(e) {
				$.log.add('error', '$.file.download had a error', {error: e.toString(), stack: new Error().stack});
				p.reject();
			})
		});
		
		return (p);
	},
	open: function(path, flags) { 
		var p = new $.promise();
		
		fs.open(path, flags, function(err, fd) {
			if (err)  {
				p.reject(err);
			} else {
				p.resolve({path: path, fd: fd});
			}
		});
		
		return (p);
	},
	write: function(fd, data) { 
		var p = new $.promise();
		
		fs.write(fd, data, function(err, written, buffer) {
			if (err)  {
				p.reject(err);
			} else {
				p.resolve({fd: fd, written: written, buffer: buffer});
			}
		});
		
		return (p);
	},
	close: function(fd) { 
		var p = new $.promise();
		
		fs.close(fd, function(err, written, buffer) {
			p.resolve();
		});
		
		return (p);
	},
});

module.exports = obj;