"use strict";

var passport = $.module('/engine/node_modules/passport');
var LocalStrategy = $.module('/engine/node_modules/passport-local').Strategy;

var obj = function(app) {
	var self = this;
	
	app.use(passport.initialize());
	app.use(passport.session());
	
	passport.use(new LocalStrategy(function(username, password, done) {
		process.nextTick(function() {
			self.login({login: username, password: password}).then(function(res) {
				done(null, res);
			}, function() {
				done(null, false);
			});
		});
	}));

	app.post('/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) {
				return next(err); 
			}
			if (!user) { return
				res.json({error: true, response: 'Failed to authenticate'}); 
			}
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.json({error: false, response: self._cleanUser(user)});
			});
		})(req, res, next);
	});
	app.post('/register', function(req, res) {
        self.register(req.body).then(function(out) {
            passport.authenticate('local')(req, res, function() {
				return res.json({error: false, response: self._cleanUser(out)});
			});
        }, function(out) {
            res.status(400).json(out);
        });
    });
	app.post('/logout', function(req, res) {
		req.logout();
		res.json({response: 'logged out'});
	});
	
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});
};
obj.prototype = $.extends('!module', {
	_struct: {
        struct: 'user',
		login: '',
        salt: '',
		password: ''
    },
    _merge: function(data) {
        var copy = {};
        for (var i in this._struct) {
            copy[i] = ($.defined(data[i]))? data[i] : this._struct[i];
        }
        copy.struct = this._struct.struct;
        copy.salt = this.randomKey(16);
        copy.password = this.hash(data.password, copy.salt);
        return (copy);
    },
	_cleanUser: function(user) {
		var out = {};
		for (var i in user) {
			if (this.not(i, ['salt', 'password'])) {
				out[i] = user[i];
			}
		}
		return (out);
	},

	login: function(data) {
		var p = new $.promise(), self = this;
		
		this.mongo.find({login: data.login, struct: this._struct.struct}, {limit: 1}).then(function(res) {
			if (res.length > 0) {
				res = res[0];
				if (res.password == self.hash(data.password, res.salt)) {
                    p.resolve(res);
                } else {
                    p.reject({error: 'no user or bad password'});
                }
			} else {
				p.reject({error: 'no user or bad password'});
			}
		});
		
        return (p);
	},
    register: function(data) {
        var p = new $.promise(), self = this;

        this.mongo.find({login: data.username || '', struct: this._struct.struct}, {limit: 1}).then(function(res) {
			if (res.length > 0 || !$.defined(data.username) || !$.defined(data.password)) {
                return (new $.promise()).reject({error: true, message: 'user already has that name'});
            }
            return (self.mongo.insert(self._merge(data)));
        }).then(function(res) {
            p.resolve(res);
        }, function(res) {
            p.reject(res);
        });

        return (p);
    }
});
module.exports = obj;
