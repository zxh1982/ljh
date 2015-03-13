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

    var start = getStartDate(req.query);
    var array = [{
        $group: {
            _id:null,
            currentMoney: { $sum: "$currentMoney" },
            expenseMoney: { $sum: "$expenseMoney" }
        }
    }];

    if (start) {
        array.unshift(
            {
                $match : { 'createDate' : { $gt: start, $lte : new Date()} }
            }
        );
    }

    var q = Member.aggregate(array);

    q.exec(function(err, result) {

        Member.find(start ? {'createDate' : { $gt: start, $lte : new Date()}} : {}).count(function(err, count) {
            if (result[0]) {
                result[0].memberCount = count;
                console.log(result[0]);
                res.render('memberList', {title:'会员列表',  aggregate:result[0], user: req.session.user});
            }
        })
    })
};

MemberManager.prototype.statistics = function(req, res) {
    var start = getStartDate(req.query);
    var array = [{
        $group: {
            _id:null,
            currentMoney: { $sum: "$currentMoney" },
            expenseMoney: { $sum: "$expenseMoney" }
        }
    }];

    if (start) {
        array.unshift(
            {
                $match : { 'createDate' : { $gt: start, $lte : new Date()} }
            }
        );
    }

    var q = Member.aggregate(array);

    q.exec(function(err, result) {

        Member.find(start ? {'createDate' : { $gt: start, $lte : new Date()}} : {}).count(function(err, count) {
            if (result[0]) {
                result[0].memberCount = count;
                console.log(result[0]);
                res.json(result[0]);
            } else {
                res.json('{}');
            }
        })
    })
};

function getStartDate (query) {
    var now = new Date();
    var start = new Date(now);
    start.setHours(0,0,0);
    if (query.dateRange === 'dateRange1') {

    } else if (query.dateRange === 'dateRange2') {
        start.setDate(start.getDate() - start.getDay() + 1);//本周
    } else if (query.dateRange === 'dateRange3') {
        start.setDate(0);//本用
    } else {
        start = null;
    }
    return start;
};

MemberManager.prototype.getMembers = function(req, res) {
    var now = new Date();
    var start = getStartDate(req.query);
    var q;
    if (start) {
        q = Member.find({'createDate':{'$gt':start, '$lt':now}});
    } else {
        q = Member.find();
    }

    q.exec(function(err, results) {
        res.json(results);
    });
};


MemberManager.prototype.inputNum = function(req, res) {
    res.render('inputCardNum', {title: '新建会员'});
};

MemberManager.prototype.enterInput = function(req, res) {
    var memberNum = req.body.memberNum;

    if (!memberNum) {
        return res.redirect('/member/inputNum');
    }

    Member.findOne({memberNum: memberNum}, function(err, results) {
        if (err) {
            return;
        }
        console.log(results);
        if (!results) {

            Member.find().count(function(err, count) {
                if (err) throw err;
                var str= sprintf("%06s", count);
                res.redirect('/member/input?memberNum=' + memberNum + "&contractNum=" + str);
            });

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
    req.body.password = '123456';
    req.body.shopName = "总店";
	Member.create(req.body, function(err) {
		if (err) {
			throw err;
		}
        delete req.body.password;
        var jsonString = JSON.stringify(req.body);
        res.redirect('/member/contract?memberNum=' + req.body.memberNum);
	});
};

MemberManager.prototype.contract = function(req, res) {
    var q = Member.findOne({'memberNum': req.query.memberNum});
    q.exec(function(err, result) {
        if (err) {
            throw  err;
        }

        delete result.password;
        res.render('contract', {title: '会员合同', member: result});
    });

};


