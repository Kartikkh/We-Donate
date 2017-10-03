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
var helmet = require('helmet');
var morgan = require('morgan');
var expressValidator = require('express-validator');
var https = require('https');
var fs = require('fs');

var HTTPSOptions = {
    key  : fs.readFileSync('certificate/server.key'),
    cert : fs.readFileSync('certificate/server.crt')
 };

var config = require('config');
app.set('view engine', 'jade');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use(helmet());

var MongoOptions = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};

// config.DBHost
mongoose.connect('mongodb://localhost/we-donate', MongoOptions, (err, db)=>{
    if(err){
        console.log("Connection to MongoStore could not be made", err);
    }
    else{
        console.log("Connection to Mongo Store Successful");
    }
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}



app.use(expressValidator());
app.use('/userAuth', userAuth);
app.use('/ngoAuth',ngoAuth);

var port = process.env.PORT || 8080;
app.set('port', port);

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
    res.send({'error':'Not Found'});
});



https.createServer(HTTPSOptions, app).listen(app.get('port'),(err)=>{
    if(err)
        console.log(err)
    else
        console.log('Server listening on '+app.get('port'))
})


module.exports = app;