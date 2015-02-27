
/*
 * GET home page.
 */

exports.index = function(req, res){
    if (!req.session.user) {
        res.render('login', { title: '乐键汇会员管理系统-登录' });
    } else {
        res.redirect('/member/showList');
    }

};

