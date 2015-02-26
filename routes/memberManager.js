'use strict';

var mongoose = require('mongoose');
require('./schema/member')();

var Member = mongoose.model('Member');

function MemberManager(app) {
	this.app = app;
	//mongoose.connect('mongodb://localhost/ljh');
}

var mm = new MemberManager();
module.exports = mm;

/**
 * [showList 显示列表]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
MemberManager.prototype.showList = function(req, res) {

	var q = Member.find();
	q.exec(function(err, results) {
		res.render('memberList', {title: '会员列表', memberList: results});
	});
};



MemberManager.prototype.inputNum = function(req, res) {
    res.render('inputCardNum', {title: '输入卡号'});
};

MemberManager.prototype.enterInput = function(req, res) {
    var memberNum = req.body.memberNum;
    if (!memberNum) {
        return;
    }

    Member.findOne({memberNum: memberNum}, function(err, results) {
        if (err) {
            return;
        }
        console.log(results);
        if (!results) {
            res.redirect('/member/input?memberNum=' + memberNum);
        } else {
            res.end('卡号: ' + memberNum + '已经存在！');
        }
    });

};

/**
 * [input 会员录入]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
MemberManager.prototype.input  = function(req, res) {
	var memberNum = req.query.memberNum;
	res.render('memberInput', {title: '新建会员', memberNum: memberNum});
};

/**
 * [newMember 新建会员]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
MemberManager.prototype.newMember = function(req, res) {

    req.body.createDate = new Date();
	Member.create(req.body, function(err) {
		if (err) {
			throw err;
		}

		var q = Member.find();
		q.exec(function(err, results) {
		 	if (err) {
		 		throw err;
		 	}
            res.redirect('/member/showList');
		 	//res.end(JSON.stringify(results));
		});
	});


};






