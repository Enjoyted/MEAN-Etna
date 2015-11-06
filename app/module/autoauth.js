/**
 * Created by teddy on 06/11/15.
 */
"use strict";

var passport = $.module('/engine/node_modules/passport');

var FACEBOOK_APP_ID = "1666649750283501";
var FACEBOOK_APP_SECRET = "b9a9aff20902582a64df6f8c78fea929";

var FacebookStrategy = $.module('/engine/node_modules/passport-facebook').Strategy;

passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "/#/home"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate(profile, function(err, user) {
            if (err) { return done(err); }
            done(null, user);
        });
    }
));

var obj = function(app) {
    var self = this;
    this._path = '/auth/facebook';

    app.get(this._path, passport.authenticate('facebook'));

    // Facebook will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    app.get(this._path + '/callback',
        passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/login'
            }
        )
    );

    app.get(this._path + '/', function(req, res) {
        self.getAll().then(function(out) {
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
        email: ''
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
        return (this.mongo.update({_id: this.objectId(id), struct: this._struct.struct}, data));
    },
    add: function(data) {
        return (this.mongo.insert(this._merge(data)));
    }
});
module.exports = obj;
