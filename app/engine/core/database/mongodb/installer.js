"use strict";

var os = $.module('os'), http = $.module('http'), fs = $.module('fs'), path = $.module('path'), zlib = $.module('zlib');

var obj = {
	url: {
		win32: {
			url: 'http://downloads.mongodb.org/win32/mongodb-win32-x86_64-v3.0-latest.zip?_ga=1.112981572.1551922970.1433319278',
			name: 'mongodb-win32-x86_64-v3.0-latest.zip',
		},
		linux: {
			url: 'http://downloads.mongodb.org/linux/mongodb-linux-i686-latest.tgz?_ga=1.117084614.1551922970.1433319278',
			name: 'mongodb-linux-x86_64-3.0.4.tgz',
		}
	},
	isReady: function() {
		return ($.file.exists($.file.Path.DB + 'mongodb/binary/'));
	},
	initFolder: function() {
		$.console.info().white('mongodb :').cyan('init mongodb directory').print();
		return ($.file.createFolder($.file.Path.DB + 'mongodb/binary/'));
	},
	hasPlatform: function() {
		var self = this;
		var p = new $.promise();
		if ($.defined(self.url[os.platform()])) {
			$.console.info().white('mongodb :').cyan('found auto download').print();
			p.resolve();
		} else {
			$.console.info().white('mongodb :').yellow('no auto install please download mongodb and place it in ' + $.file.Path.DB + 'mongodb/binary/').print();
			p.reject();
		}
		return (p);
	},
	install: function() {
		var self = this, p = new $.promise();
		if (isset(self.url[os.platform()])) {
			var base = self.url[os.platform()];
			
			$.file.exists($.file.Path.CACHE + base.name).then(function() {
				$.console.info().white('mongodb :').green('mongodb found in cache.').print();
				return (self.unzip());
			}, function() {
				$.console.info().white('mongodb :').cyan('started downloading mongodb.').print();
				$.file.download($.file.Path.CACHE + base.name, base.url).then(function() {
					$.console.info().white('mongodb :').green('mongodb has been downloaded.').print();
					self.unzip();
				}, function() {		
					$.console.info()
						.white('mongodb :')
						.red('error trying to download the file or write to the path : ', $.file.Path.CACHE + base.name)
					.print();
				})
			}).then(function() {
				p.resolve();
			});
			
			return (p);
		}
		
		return (p.reject('no os found'));
	},
	decompress: function() {
		var self = obj, base = self.url[os.platform()];
		var unzip = $.module('/engine/node_modules/unzip/'), tar = $.module('/engine/node_modules/tar/');
		var param = {path: $.file.Path.DB + 'mongodb/binary/'}, file = $.file.Path.CACHE + base.name, p = new $.promise();
		
		if (path.extname(file) === '.tgz') {
			fs.createReadStream(file)
			.pipe(zlib.createGunzip())
			.pipe(tar.Extract(param))
			.on('error', function(err) { 
				p.reject(err);
			})
			.on("end", function() { 
				p.resolve();
			})
		} else if (path.extname(file) === '.zip') {
			var handle = unzip.Extract(param);
			
			handle.on('error', function(err) {
				p.reject(err);
			});
			handle.on('close', function() {
				p.resolve();
			});
			fs.createReadStream(file).pipe(handle);
		} else {
			p.reject({error: 'not valid file type'});
		}
		
		return (p);
	},
	unzip: function() {
		var done = new $.promise();
		
		obj.decompress().then(function() {
			return ($.file.readdir($.file.Path.DB + 'mongodb/binary/'));
		}, function(err) {
			$.console.error().white('mongodb :').red(err).print();
			done.reject(err);
		}).then(function(res) {
			var wait = [];
			for (var i in res.files) {
				wait.push($.file.stat($.file.Path.DB + 'mongodb/binary/' + res.files[i] + '/'));
			}
			return ($.all(wait));
		}).then(function(res) {
			var p = new $.promise();
			for (var i in res) {
				if (res[i].stats.isDirectory()) {
					return ($.file.readdir(res[i].path));
				}
			}
			return (p.reject());
		}, function(err) {
			$.console.error().white('mongodb :').red('error reforming directory', err).print();
			done.reject(err);
		}).then(function(res) {
			var wait = [];
			for (var i in res.files) {
				wait.push($.file.rename(res.path + res.files[i], $.file.Path.DB + 'mongodb/binary/' + res.files[i]));
			}
			
			return ($.all(wait).then(function() {
				return ($.file.remove(res.path));
			}));
		}, function() {
			$.console.error().white('mongodb :').red('error cant find the base directory.').print();
			done.reject('error cant find the base directory.');
		}).then(function() {
			done.resolve();
		});
		
		return (done);
	}
}

module.exports = function() {
	var p = new $.promise();
	
	obj.isReady().then(function() {
		$.console.info().white('mongodb :').green('already installed').print();
		p.resolve();
	}, function() {
		$.console.info().white('mongodb :').yellow('starting to install').print();
		return (obj.initFolder());
	}).then(function() {
		return (obj.hasPlatform());
	}).then(function() {
		return (obj.install());
	}).then(function() {
		p.resolve();
	}, function() {
		p.resolve();
	});
	
	return (p);
};
