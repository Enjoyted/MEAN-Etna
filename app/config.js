"use strict";

var fs = $.module('fs');

module.exports = {
	env: 'dev',
	crypto: {
		type: 'sha1', // what algo to use
		salt: 'gr5g87s8d875-sha1', // app salt
		sub: 8, // hash the hash how many times
	},
	console: {
		error: true,
		warning: true,
		debug: true,
		info: true
	},
	log: {
		saveType: 'file', // NEEDS TO BE ADDED (db, file, email, sms)
		path: appRoot + '/app/resources/logs/',
		info: true,
		error: true,
		warning: true,
		fatal: true,
	},
	enum: {
		map: 'underscore', // 'camelcase'
		file: appRoot + '/app/resources/enum.js'
	},
	translate: {
		support: {
			'EN': 'en.js',
			'EN_US': 'en.js',
			'FR': 'fr.js'
		},
		lang: 'EN',
		path: appRoot + '/app/resources/lang/'
	},
	http: {
		gZip: false, // caches static pages  
		run: true,
		port: 3000,
		ip: '0.0.0.0',
		
		ssl: false,
		sslPort: 443,
		/*
			openssl req -newkey rsa:4096 -new -nodes -keyout key.pem -out csr.pem
			openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
		*/
		key: '/app/resources/keys/key.pem',
		cert: '/app/resources/keys/server.crt',
		ca: null,
		ciphers: [
			'ECDHE-RSA-AES128-GCM-SHA256',
			'ECDHE-ECDSA-AES128-GCM-SHA256',
			'ECDHE-RSA-AES256-GCM-SHA384',
			'ECDHE-ECDSA-AES256-GCM-SHA384',
			'DHE-RSA-AES128-GCM-SHA256',
			'DHE-DSS-AES128-GCM-SHA256',
			'kEDH+AESGCM',
			'ECDHE-RSA-AES128-SHA256',
			'ECDHE-ECDSA-AES128-SHA256',
			'ECDHE-RSA-AES128-SHA',
			'ECDHE-ECDSA-AES128-SHA',
			'ECDHE-RSA-AES256-SHA384',
			'ECDHE-ECDSA-AES256-SHA384',
			'ECDHE-RSA-AES256-SHA',
			'ECDHE-ECDSA-AES256-SHA',
			'DHE-RSA-AES128-SHA256',
			'DHE-RSA-AES128-SHA',
			'DHE-DSS-AES128-SHA256',
			'DHE-RSA-AES256-SHA256',
			'DHE-DSS-AES256-SHA',
			'DHE-RSA-AES256-SHA',
			'!aNULL',
			'!eNULL',
			'!EXPORT',
			'!DES',
			'!RC4',
			'!3DES',
			'!MD5',
			'!PSK'
		]
	},
	database: {
		type: 'mongodb',
	
		mongodb: {
			run: true, // manage the uptime of the a local database
			ip: 'mongodb://localhost/test'
		},
	}
};