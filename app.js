const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const config = require('config');
const app = express();
const JWTvalidation =  require('./middleware/JsonToken');
const userAuth = require('./routes/User/userAuth.js');
const ngoAuth = require('./routes/Ngo/ngoAuth');
const ngoEvent =  require('./routes/Ngo/ngoEvents');
const ngoProfile = require('./routes/Ngo/ngoProfile');
const cors = require('cors');

const userInfo = require('./routes/User/userRoutes');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));


app.use(helmet());

const MongoOptions = {
    server: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    }
};

// config.DBHost
mongoose.connect(config.DBHost, MongoOptions, (err, db) => {
    if (err) {
        return console.log('Connection to MongoStore could not be made', err);
    }
    console.log('Connection to Mongo Store Successful');
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


if(config.util.getEnv('NODE_ENV') !== 'production' ){
    require('dotenv').load();
}

if (config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(expressValidator());
app.use('/userAuth', userAuth);
app.use('/ngoAuth', ngoAuth);

app.use(JWTvalidation);

app.use('/ngoEvent', ngoEvent);
app.use('/ngoProfile',ngoProfile);
ap.use('/userInfo' ,userInfo );
const port = process.env.PORT || 3000;
app.set('port', port);



app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;

    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.send({ 'error': 'Not Found' });
});



module.exports = app;
