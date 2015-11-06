"use strict";

var obj = function(app) {
	var self = this;
	app.get('/', function(req, res) {
		self.index(req, res);
	});
};
obj.prototype = $.extends('!base', {
	index: function(req, res) {
		res.sendFile(appRoot + '/public/index.html')
	}
});
module.exports = obj;
