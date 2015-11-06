"use strict";

var database = $.module('/engine/core/database.js'), http = $.module('/engine/core/httpServer.js');
var mongo = $.module('/engine/core/mongodb.js');

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
	orm: function() {
		var orm = new mongo(), p = new $.promise();
		
		$.obm.add('orm', orm);
		orm.connect($.config.get('database.mongodb.ip')).then(function() {
			p.resolve();
		});
		
		return (p);	
	}
};