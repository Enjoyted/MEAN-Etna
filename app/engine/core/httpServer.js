"use strict";

var express = $.module('/engine/node_modules/express'), bodyParser = $.module('/engine/node_modules/body-parser');

var session = $.module('/engine/node_modules/express-session');
var cookieSession = $.module('/engine/node_modules/cookie-session');
var cookieParser = $.module('/engine/node_modules/cookie-parser');
var passport = $.module('/engine/node_modules/passport');

var obj = function(callback) {
	this._config = $.config.get('http');
	this.app = express();
	this.app.use(express.static(appRoot + '/public'));
	this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
	this.app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        if ('OPTIONS' == req.method) {
            res.send(200);
        } else {
            next();
        }
    });
	this.app.use(cookieParser());

    /*this.app.use(session({
        name: 'horseSHIT',
		secret: 'horse',
		resave: true,
		saveUninitialized: true,
        cookie: {
			httpOnly: true,
			maxAge: 2419200000
		}
    }));*/
	this.app.use(cookieSession({
		keys: ['key1', 'key2']
	}));
		
	this.app.use(passport.initialize());
	this.app.use(passport.session());
	
    this.server(callback);
};
obj.prototype = $.extends('!base', {
	_cache: {},
	_load: function() {
		var self = this;
		return ($.file.readdir(appRoot + '/app/module/').then(function(res) {
			for (var i in res.files) {
				var path = '/module/' + res.files[i];
				var a = $.module(path);
				self._cache[path] = new a(self.app);
			}
			return (true);
		}));
	},
	
	server: function(callback) {
		var self = this;
		$.console.info('start http server');
		
		this._load().then(function() {	
			self._server = self.app.listen(self._config.port, function () {
				var host = self._server.address().address;
				var port = self._server.address().port;

				$.console.info('app listening at host: ', host, ' port: ', port);
				callback(self._app);
			});
		});
		return (this);
	},
	close: function() {
		var p = new $.promise();
		return (p.resolve());
	}
});

module.exports = obj;