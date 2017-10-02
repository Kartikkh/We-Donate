const router = require('express').Router();
var User  = require('../../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var bcrypt = require('bcrypt');
var express = require('express');
var app = express();
var status = require('../../stubs/status');

router.post('/signup',(req, res, next)=>{

    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('username', 'Registration Number is Required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
  //  req.checkBody('contactNo', 'contactNumber is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.json(status.field_missing);
    }

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
                res.json({
                   "message":"Username Allready exits"
                });
            }
            else
                res.json({
                    "message":"Email Allready exits"
                });
        }
        else{
            User.createUser(newUser,(err,user)=>{
                if(err)
                    throw err;
                //generateToken  // console.log(user)

                jwt.sign({
                    username: req.body.username,
                },  'tokenbasedAuthentication', {
                    expiresIn: 60*2
                },(err, token)=>{
                    if(err){
                        throw err;
                    }
                    else{
                        res.json({
                            'token' : token ,
                            'success' : true
                        })
                    }
                });
            })
        }
    })

});

router.post('/login', function(req, res) {

        var username= req.body.username;
    User.getUserByUsername(username,'',(err, user)=>{

        if(err)
            throw(err);
        if(!user)
            res.json({ success: false, message: 'Authentication failed. User not found.'});

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.local.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        jwt.sign({
            username: req.body.username,
        },  'tokenbasedAuthentication', {
            expiresIn: 60*2
        },(err, token)=>{
            if(err){
                throw err;
            }
            else{
                res.json({
                    'token' : token ,
                    'success' : true
                })
            }
        });
    });

});



module.exports = router;