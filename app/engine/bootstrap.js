"use strict";

var exit = $.module('/engine/core/exit.js'), init = $.module('/engine/core/init.js');
var base = $.module('/engine/base/base.js');

$.console.info()
	.white('________________________________')
	.magenta('\n\tapp Startup')
	.white('\n________________________________')
.print();

var p = new $.promise();
base.prototype._obm = $.obm;

init.database().then(function() {
	return (init.httpServer());
}).then(function() {
	p.resolve();
});

/*
	clean close of the application
*/
(new exit()).on(function() {
	var p = new $.promise();
	
	$.log.save().then(function() {
		p.resolve();
	});
	
	return (p);
});