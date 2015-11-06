"use strict";

var obj = function() {}
obj.prototype = $.extends('!base', {
    _session: {},
	mongo: $.obm.get('orm'),
    objectId: function(id) {
        return (this.mongo.ObjectId(id));
    }
});

module.exports = obj;
