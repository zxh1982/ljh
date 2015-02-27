'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
console.log('member ...');
module.exports = function() {
	var MemberSchema = new Schema({
		memberNum: {     //会员卡号
            type:String,
            required: true
        },
		name :{  //姓名
            type:String,
            required: true
        },
        sex: {
            type: Number,
            enum:[1,2]
        },
		birthday: Date,    //生日
		phoneNum: String,  //手机号码
		contractNum: String, //合同号
		receiptNum: String,  //收据号
		certificateType:String, //证件类型
        certificateNum: String, //证件号
		email:String,       //电子邮箱
		nationality: String,//国籍
		homeAddress: String,//家庭地址
		organization: String,//工作单位
		emergencyContractPerson: String, //紧急联系人
		membershipConsultant: String,//会籍顾问
		password: String, //密码
        cardType: Number, //卡类型：1，2，3
        cardStatus: Number, //状态 0,1,2
        createDate: Date,   //开卡日志
        expirationDate: Date,//到期时间
        currentMoney: Number, //卡内余额
        expenseMoney: Number, //总消费
        shopName: String,    //门店名字
        operator: String     //操作员
	});

	mongoose.model('Member', MemberSchema);
};