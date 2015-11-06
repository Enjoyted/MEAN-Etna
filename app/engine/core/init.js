"use strict";

var database = $.module('/engine/core/database.js'), http = $.module('/engine/core/httpServer.js');

module.exports = {
	_obm: {},
	httpServer: function() {
		var p = new $.promise();
		
		$.obm.add('http', new http(function() {
			p.resolve();
		}));
		
		return (p);
	},
	database: function() {
		var p = new $.promise();

		$.obm.add('db', new database(function() {
			p.resolve();
		}));
		
		return (p);
	},
};