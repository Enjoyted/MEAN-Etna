"use strict";

var obj = function(app) {
	var self = this;
	this._path = '/rest/article';
	
	app.get(this._path + '/', this.isLoggedIn, function(req, res) {
		self.getAll().then(function(out) {
            res.json(out);
        }, function(out) {
            res.status(400).json(out);
        });
	});
	
	app.get(this._path + '/:id', this.isLoggedIn, function(req, res) {
		self.getByID(req.params.id).then(function(out) {
            res.json(out);
        }, function(out) {
            res.status(400).json(out);
        });
	});
	
	app.delete(this._path + '/:id', this.isLoggedIn, function(req, res) {
		self.removeById(req.params.id).then(function(out) {
            res.json(out);
        }, function(out) {
            res.status(400).json(out);
        });
	});
	
	app.put(this._path + '/:id', this.isLoggedIn, function(req, res) {
		self.update(req.params.id, req.body).then(function(out) {
            res.json(out);
        }, function(out) {
            res.status(400).json(out);
        });
	});
	
	app.post(this._path + '/', this.isLoggedIn, function(req, res) {
		self.add(req.body).then(function(out) {
			res.json(out);
		}, function(out) {
			res.status(400).json(out);
		});
	});
};
obj.prototype = $.extends('!module', {
    _struct: {
        struct: 'article',
        nom: '',
        introduction: '',
        description: '',
        tags: '',
        image: '',
        pseudo: '',
        email: '',
        date: new Date().getTime(),
        status: 1
    },
    _merge: function(data) {
        var copy = {};
        for (var i in this._struct) {
            copy[i] = ($.defined(data[i]))? data[i] : this._struct[i];
        }
        copy.struct = this._struct.struct;
        return (copy);
    },

	getAll: function() {
        return (this.mongo.find({struct: this._struct.struct}));
	},
	getByID: function(id) {
        return (this.mongo.find({_id: this.objectId(id), struct: this._struct.struct}));
	},
	removeById: function(id) {
        return (this.mongo.remove({_id: this.objectId(id), struct: this._struct.struct}));
	},
	update: function(id, data) {
		delete data._id;
        return (this.mongo.update({_id: this.objectId(id), struct: this._struct.struct}, data));
	},
	add: function(data) {
		return (this.mongo.insert(this._merge(data)));
	}
});
module.exports = obj;
