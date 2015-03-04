
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
SessionStore = require("session-mongoose")(express);

var store = new SessionStore({
    url: "mongodb://localhost/session",
    interval: 120000 // expiration check worker run interval in millisec (default: 60000)
});


var app = express();
var memberManager = require('./routes/memberManager');

// all environments
app.set('port', process.env.PORT || 36000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.cookieSession({secret : 'ljh.ixuexie.com'}));
app.use(express.session({
    secret : 'ljh.ixuexie.com',
    store: store,
    cookie: { maxAge: 900000 } // expire session in 15 min or 900 seconds
}));

app.use(function(req, res, next){
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    if (err) res.locals.message = '<div class="alert alert-error">' + err + '</div>';
    next();
});


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/login', user.login);
app.get('/loginout', user.loginout);
app.all('/login', notAuthentication);
app.get('/logout', authentication);


app.get('/member/showList', memberManager.showList);

app.get('/member/inputNum', authentication);
app.get('/member/inputNum', memberManager.inputNum);

app.get('/member/input', authentication);
app.get('/member/input', memberManager.input);
app.get('/member/getContractNum', memberManager.getContractNum);
app.get('/member/getMembers', memberManager.getMembers);
app.get('/member/contract', memberManager.contract);
app.post('/member/newMember', memberManager.newMember);
app.post('/member/enterInput', memberManager.enterInput);



function authentication(req, res, next) {
    if (!req.session.user) {
        req.session.error='请先登陆';
        return res.redirect('/');
    }
    next();
}

function notAuthentication(req, res, next) {
    if (req.session.user) {
        req.session.error='已登陆';
        return res.redirect('/');
    }
    next();
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
