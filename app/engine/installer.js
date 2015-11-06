"use strict";

var spawn = $.module('child_process').exec, project = $.module('/engine/package.json');
var os = $.module('os'), http = $.module('http'), fs = $.module('fs'), path = $.module('path'), zlib = $.module('zlib');


$.console.info()
.white('________________________________')
.magenta('\n\tapp Installer')
.white('\n________________________________').print();

var finished = function() {
	$.console.info()
	.magenta(' - app Finished').yellow('loading Bootstrapper')
	.white('\n--------------------------------\n').print();
	
	setTimeout(function() { $.module('/engine/bootstrap.js'); }, 200);
}

var debug = false;
$.file.createFolder($.file.Path.LOG).then(function() {
	return ($.file.createFolder($.file.Path.CACHE));
})
.then(function() { // see if we have the packages
	var wait = [];
	
	for (var i in project.dependencies) {
		wait.push($.file.exists(appRoot + '/app/engine/node_modules/' + i));
	}
	//console.log(wait);
	
	return ($.all(wait));
}, function() {
	$.console.warning("reject");
})
.then(function() { // we do
	$.console.info().white('packages :').green('instaled').print();
	return ((new $.promise()).resolve());
}, function() { // we don't
	var p = new $.promise();
	
	$.console.info().white('packages :').yellow('installing').print();
	spawn('npm --prefix ./app/engine install', function (error, stdout, stderr) {
		if (error) {
			console.log(error);
		}
		p.resolve();
	})
	
	return (p);
})
.then(function() {
	$.console.info().white('packages :').green('done').print();
	return ($.file.remove(appRoot + '/app/engine/etc'));
})
.then(function() {
	finished();
});
