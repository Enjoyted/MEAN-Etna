"use strict";

var obj = function() {
	this._callback = null;
	this._init();
	return (this);
}
obj.prototype = {
	_closeing: false,
	_exit: function(code) {
		if (!this._closeing) {
			var self = this, p = new $.promise();
			
			this._closeing = true;
			$.console.info()
			.white('_______________ exit _________________')
			.cyan('\n\tcloseing app down code:', code).print();
			
			if ($.defined(this._callback)) {
				this._callback().then(function() {
					p.resolve();
				});
			} else {
				$.console.warning('exit: No callback');
				p.resolve();
			}
			
			p.then(function() {
				$.console.info().white('--------------------------------').print();
				process.exit(code);
			});
		}
	},
	_init: function() {
		var self = this;
		process.on('exit', function () {
			self._exit(0);
		});
		process.on('SIGINT', function () {
			$.log.add('error', 'application close bacause of a SIGINT.');
			self._exit(2);
		});
		process.on('uncaughtException', function(e) {
			$.log.add('fatal', 'the was a uncaught exception', {error: e.toString(), stack: e.stack});
			$.console.error().red('Fatal:', 'the was a uncaught exception', e.stack).print();
			self._exit(99);
		});
	},
	on: function(c) {
		this._callback = c;
		return (this);
	},
}
module.exports = obj;