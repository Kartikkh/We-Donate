var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var userAuth = require('./routes/User/userAuth.js');
var ngoAuth = require('./routes/Ngo/ngoAuth');
var app = express();
var secret = require('./config/DButil');


app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(secret.url,(err)=>{
    if(err){
        console.log('Connection to MongoDB Failed!');
        console.log(err);
    }
    else{
        console.log('Connection to MongoDB Successfull!');
    }
});


app.use('/userAuth', userAuth);
app.use('/ngoAuth',ngoAuth);






var port = process.env.PORT || 8080;
app.set('port', port)
app.listen(app.get('port'),(err)=>{
    if(err)
        console.log(err)
    else
        console.log('Server listening on '+app.get('port'))
})

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;