'use strict';

var mongoose = require('mongoose');
var sprintf = require('../public/javascripts/sprintf');
require('./schema/member')();

var Member = mongoose.model('Member');

function MemberManager(app) {
	this.app = app;
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
		res.render('memberList', {title: '会员列表', user: req.session.user, memberList: results});
	});
};



MemberManager.prototype.inputNum = function(req, res) {
    res.render('inputCardNum', {title: '输入卡号'});
};

MemberManager.prototype.enterInput = function(req, res) {
    var memberNum = req.body.memberNum;
    var contractNum = req.body.contractNum;
    if (!memberNum) {
        return;
    }

    Member.findOne({memberNum: memberNum}, function(err, results) {
        if (err) {
            return;
        }
        console.log(results);
        if (!results) {
            res.redirect('/member/input?memberNum=' + memberNum + "&contractNum=" + contractNum);
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
    var contractNum = req.query.contractNum;
	res.render('memberInput', {title: '新建会员', memberNum: memberNum, contractNum: contractNum});
};

MemberManager.prototype.getContractNum = function(req, res) {
    Member.find().count(function(err, count) {
        if (err) throw err;
        var str= sprintf("%06s", count);
        res.end(str);
    });
};


/**
 * [newMember 新建会员]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
MemberManager.prototype.newMember = function(req, res) {

    req.body.createDate = new Date();
    req.body.cardStatus = 0;
    req.body.operator = req.session.user.name;
    req.body.shopName = "总店";
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






