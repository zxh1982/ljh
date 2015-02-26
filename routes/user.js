
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


    var name = req.body.user;
    var password = req.body.password;

    async.waterfall([
        function(cb) {
            User.findOne({'name': name},function(e, result) {
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
                cb(null);
            } else {
                cb('密码不正确');
            }
        }
    ], function(e) {
        if (e) {
            res.end(e);
            return
        }
        res.redirect('/member/inputNum');
    });
};
