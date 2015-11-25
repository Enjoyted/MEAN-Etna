"use strict";

var obj = function(app) {
	var self = this;
	this._path = '/rest/comment/:articleID/';
	
	app.get(this._path + '/', this.isLoggedIn(), function(req, res) {
		self.setParent(req.params.articleID);
		self.getAll().then(function(out) {
            res.json(out);
        }, function(out) {
            res.status(400).json(out);
        });
	});
	
	app.get(this._path + '/:id', this.isLoggedIn(), function(req, res) {
		self.setParent(req.params.articleID);
		self.getByID(req.params.id).then(function(out) {
            res.json(out);
        }, function(out) {
            res.status(400).json(out);
        });
	});
	
	app.delete(this._path + '/:id', this.isLoggedIn(), function(req, res) {
		self.setParent(req.params.articleID);
		self.removeById(req.params.id).then(function(out) {
            res.json(out);
        }, function(out) {
            res.status(400).json(out);
        });
	});
	
	app.put(this._path + '/:id', this.isLoggedIn(), function(req, res) {
		self.setParent(req.params.articleID);
		self.update(req.params.id, req.body).then(function(out) {
            res.json(out);
        }, function(out) {
            res.status(400).json(out);
        });
	});
	
	app.post(this._path + '/', this.isLoggedIn(), function(req, res) {
		self.setParent(req.params.articleID);
		self.add(req.body).then(function(out) {
			res.json(out);
		}, function(out) {
			res.status(400).json(out);
		});
	});
};
obj.prototype = $.extends('!module', {
    _struct: {
        struct: 'comment',
		parent: '',
        pseudo: '',
		message: '',
		note: '3',
		date: new Date().getTime(),
        status: 1
    },
    _merge: function(data) {
        var copy = {};
        for (var i in this._struct) {
            copy[i] = ($.defined(data[i]))? data[i] : this._struct[i];
        }
        copy.struct = this._struct.struct;
		copy.parent = this._parentID;
        return (copy);
    },

	setParent: function(id) {
		this._parentID = id;
	},
	getAll: function() {
        return (this.mongo.find({parent: this._parentID, struct: this._struct.struct}));
	},
	getByID: function(id) {
        return (this.mongo.find({parent: this._parentID, _id: this.objectId(id), struct: this._struct.struct}));
	},
	removeById: function(id) {
        return (this.mongo.remove({parent: this._parentID, _id: this.objectId(id), struct: this._struct.struct}));
	},
	update: function(id, data) {
        return (this.mongo.update({parent: this._parentID, _id: this.objectId(id), struct: this._struct.struct}, data));
	},
	add: function(data) {
		return (this.mongo.insert(this._merge(data)));
	}
});
module.exports = obj;
