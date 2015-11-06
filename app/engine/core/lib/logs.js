"use strict";

var cluster = $.module('cluster'), fs = $.module('fs');

var obj = function(config) {
	config = config || {};
	
	this._storage = [];
	this._prefix = config.prefix || '';
	this._config = {
		log: $.config.get('log'),
	}
}
obj.prototype = $.extends('!base', {
	add: function(type, msg, obj) {
		if ($.defined(this._config.log[type]) && this._config.log[type] !== false) {
			var date = new Date();
			this._storage.push({
				type: type.toUpperCase(),
				file: this._prefix + 'log_' + date.toJSON().slice(0,10) + '_' + ((cluster.isMaster) ? 'master' : 'worker' + cluster.worker.id),
				msg: msg,
				time: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
				object: ($.defined(obj))? JSON.stringify(obj) : '',
			});
		}
	},
	_format: function(row) {
		return ({
			log:  row.type + ' (' + row.time + ') : ' + row.msg.replace(/\n/g, ' ') + ((row.object !== '') ? ' |extra| "' + row.object + '"' : '') + ';',
			min: JSON.stringify(row)
		})
	},
	save: function() {
		var files = {}, p = new $.promise();
		$.console.info().white('logger :').yellow('Saving logs from memory ...').print();
		
		var wait = [], self = this;
		for (var i in this._storage) {
			var row = this._storage[i], path = this._config.log.path + row.file + '.log';
			if (!$.defined(files[path])) {
				files[path] = 0;
				wait.push($.file.open(path, 'a').then(function(res) {
					files[res.path] = res.fd;
					return ($.file.write(res.fd, '--------------- save -----------------\r\n'));
				}));
			}
		}
		
		$.all(wait).then(function() {
			var write = new $.promise(), out = {error: 0, success: 0};
			var next = function(i) {
				if ($.defined(self._storage[i])) {
					var row = self._storage[i];
					$.file.write(files[self._config.log.path + row.file + '.log'], self._format(row).log + '\r\n').then(function() {
						self._storage.splice(0, 1);
						out.success += 1;
						next(i);
					}, function() {
						self._storage.splice(0, 1);
						out.error += 1;
						next(i);
					});
				} else {
					write.resolve(out);
				}
			}
			next(0);
			return (write);
		}).then(function(out) {
			var close = [], next = new $.promise();
			for (var i in files) {
				close.push($.file.close(files[i]));
			}
			$.all(close).then(function() {
				$.console.info().white('logger :').cyan('closed file handle.').print();
				next.resolve(out)
			})
			return (next);
		}).then(function(out) {
			$.console.info().white('logger :').green('Finished saving logs succes:', out.success, 'error:', out.error).print();
			p.resolve()
		});
		
		return (p);
	}
})

module.exports = obj;