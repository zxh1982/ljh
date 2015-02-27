
/*
 * GET users listing.
 */

'use strict';
var async = require('async');
var mongoose = require('mongoose');
require('./schema/user')();

var User = mongoose.model('user');

function UserManager(app) {
    this.app = app;
    mongoose.connect('mongodb://localhost/ljh');
}

var userManager = new UserManager();
module.exports = userManager;

UserManager.prototype.login = function(req, res) {

    var user = req.body.user;
    var password = req.body.password;

    async.waterfall([
        function(cb) {
            User.findOne({'user': user},function(e, result) {
                if (e) {
                    throw e;
                }

                if (!result) {
                    cb('帐号不存在');
                } else {
                    cb(null, result);
                }
            });
        },

        function(user, cb) {
            if (user.password === password) {
                cb(null, user);
            } else {
                cb('密码不正确');
            }
        }
    ], function(e, user) {
        if (e) {
            res.end(e);
            return
        }

        req.session.user = user;
        res.redirect('/member/showList');
    });
};

UserManager.prototype.loginout = function(req, res) {
    req.session.user = null;
    res.redirect('/');
};