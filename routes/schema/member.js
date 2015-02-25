'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
console.log('member ...');
module.exports = function() {
	var MemberSchema = new Schema({
		memberNum: String, //会员卡号
		name: String,	   //姓名
		birthday: Date,    //生日
		phoneNum: String,  //手机号码
		contractNum: String, //合同号
		receiptNum: String,  //收据号
		certificate: {
			type: String,   //证件类型
			number: String  //证件号
		},
		email:String,       //电子邮箱
		nationality: String,//国籍
		homeAddress: String,//家庭地址
		organization: String,//工作单位
		emergencyContractPerson: String, //紧急联系人
		membershipConsultant: String,//会籍顾问
		password: String, //密码
        memberCard: {
            type: Number,   //卡类型：1，2，3
            status: Number, //状态
            createDate: Date,   //开卡日志
            expirationDate: Date,//到期时间
            money: Number,  //卡内余额
            totalExpense: Number,//总消费
            shop: {
                name: String, //门店名字
                num: Number   //门店编号
            }
        },
        operator: String
	});

	mongoose.model('Member', MemberSchema);
};