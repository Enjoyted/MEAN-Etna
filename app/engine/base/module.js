"use strict";

var obj = function() {}
obj.prototype = $.extends('!base', {
	mongo: $.obm.get('orm'),
	not: function(source, object) {
		if (Array.isArray(object)) {
			for (var i in object) {
				if (source == object[i]) {
					return (false);
				}
			}
			return (true);
		} else {
			return (source == object);
		}
	},
	objectId: function(id) {
        return (this.mongo.ObjectId(id));
    },	
	isLoggedIn: function(req, res, next) {
		if (req.isAuthenticated()) {
			return (next());
		}
		res.status(401).json({error: true, message: 'not logged in'});
	}
});

module.exports = obj;
