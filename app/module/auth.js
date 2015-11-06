"use strict";

var obj = function(app) {
	var self = this;

    app.post('/login/', function(req, res) {
        self.login(req.body).then(function (out) {
            var sKey = this.randomKey(124);
            self._session[sKey] = {};

            res.cookie('session', sKey, { maxAge: 900000, httpOnly: true });
            res.json({
                sessionKey: sKey
            });
        }, function (out) {
            res.status(400).json(out);
        });
	});
    app.post('/register/', function(req, res) {
        self.register(req.body).then(function(out) {
            var sKey = this.randomKey(124);
            self._session[sKey] = true;

            res.json({
                sessionKey: sKey
            });
        }, function(out) {
            res.status(400).json(out);
        });
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

	login: function(data) {
		var p = new $.promise();
		
		this.mongo.find({login: data.login, struct: this._struct.struct}, {limit: 1}).then(function(res) {
			if (res.length > 0) {
                res = res[0];
                if (res.password === this.hash(data.password, res.salt)) {
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

        this.mongo.find({login: data.login || '', struct: this._struct.struct}, {limit: 1}).then(function(res) {
            if (res.length > 0 || !$.defined(data.login) || !$.defined(data.password)) {
                return (new $.promise()).reject('user already has that name');
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
