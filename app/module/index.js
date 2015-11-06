"use strict";

var obj = function(app) {
	var self = this;
	app.get('/', function(req, res) {
		self.index(req, res);
	});
};
obj.prototype = $.extends('!base', {
	index: function(req, res) {
		res.send('Hello World!');
	}
});
module.exports = obj;
