"use strict";

var obj = function() {}
obj.prototype = $.extends('!base', {
	mongo: $.obm.get('orm'),
    objectId: function(id) {
        return (this.mongo.ObjectId(str));
    }
});

module.exports = obj;