const router = require('express').Router();
var User = require('../models/user.js')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const authenticate = expressJwt({secret : 'server secret'});
const db = {
    updateOrCreate: function(user, cb){
        // db dummy, we just cb the user
        cb(null, user);
    }
};


function serialize(req, res, next) {
    db.updateOrCreate(req.body.username, function(err, user){
        if(err) {
            return next(err);
        }
        // we store the updated information in req.body.username again
        req.body.username = req.body.username;
        next();
    });
}


function generateToken(req, res, next) {
    req.token = jwt.sign({
        username: req.body.username,
    }, 'server secret', {
        expiresIn: 60*3
    });
    next();
}

function respond(req, res) {
    res.status(200).json({
        user: req.body.username,
        token: req.token
    });
}

passport.use(new LocalStrategy(
    function(username, password, done) {
        // database dummy - find user and verify password
        User.getUserByUsername(username,'',(err, user)=>{
            if(err)
                throw(err)
            if(!user)
                return done(null, false, {message: 'Incorrect Username'})
            User.comparePassword(password, user.local.password, (err, isMatch)=>{
                if(err)
                    throw err
                if(isMatch)
                    return done(null, user)
                else
                    return done(null, false, {message: 'Incorrect Password'})
            })
        })
    }
));

router.post('/signup',(req, res, next)=>{
    var name = req.body.name,
        username = req.body.username,
        email = req.body.email,
        password = req.body.password;
    var newUser = new User({
        local: {
            name: name,
            email: email,
            password: password,
            username: username
        },
        facebook: {

        }
    });
    User.getUserByUsername(username,email,(err, existingUser)=>{
        if(err)
            throw err
        console.log('EXISTING USER'+existingUser)
        if(existingUser){
            if(existingUser.local.username == username){
                req.flash('error_msg', 'UserName not Available')
            }
            else
                req.flash('error_msg', 'Email Already Registered')
            return res.redirect('/users/register')
        }
        else{
            User.createUser(newUser,(err,user)=>{
                if(err)
                    throw err;
                // console.log(user)
                //generateToken
                jwt.sign({
                    username: req.body.username,
                }, 'server secret', {
                    expiresIn: 60*2
                },(err, token)=>{
                    if(err){
                        throw err;
                    }
                    else{
                        req.token = token;
                        respond(req, res);
                    }
                });
            })
        }
    })

})

router.get('/me', authenticate, function(req, res) {
    console.log("Entered me route after authentication!");
    if (!req.user) return res.status(401).send({
        Message: 'You are not authorized to access this resource.'
    });
    res.status(200).json({
        Message: 'Coming Soon!'
    });
});

router.post('/auth',passport.authenticate(
    'local', {
        session: false
    }), serialize, generateToken, respond);

module.exports = router;