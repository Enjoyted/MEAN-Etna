"use strict";

var obj = function() {}
obj.prototype = $.extends('!base', {
    objectId: function(id) {
        return (this.mongo.ObjectId(id));
    },	
	isLoggedIn: function(req, res, next) {
		if (req.isAuthenticated()) {
			return (next());
		}
		res.redirect('/');
	}
});

module.exports = obj;
