"use strict";

/*
	map: 'underscore' or 'camelcase'

	will chane how it's used in the framework
	
	underscore :
		path.CACHE => PATH.CACHE
		string.user_logged => STRING.USER_LOGGED
		string.userLogged => STRING.USER_LOGGED
	
	camelcase : 
		path.CACHE => path.cache
		string.user_logged => string.userLogged
		string.userLogged => string.userLogged
	
*/

module.exports = {
	math: {
		pi: 3.14159265359,
	},
	path: {
		cache: 	appRoot + '/app/resources/cache/',
		config: appRoot + '/app/config.js',
		module: appRoot + '/app/engine/node_modules/',
		db: 	appRoot + '/app/engine/core/database/',
		build: 	appRoot + '/app/engine/core/builder/',
		public: appRoot + '/public/'
	},
	string: {
		user_logged: 'user_logged'
	}
};