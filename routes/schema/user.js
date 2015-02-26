/**
 * Created by zxh on 2/26/15.
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
console.log('User ...');
module.exports = function() {
    var UserSchema = new Schema({
        name: String,
        password: String
    });
    mongoose.model('user', UserSchema);
};
