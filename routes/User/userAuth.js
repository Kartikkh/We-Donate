const router = require('express').Router();
var User  = require('../../models/user');
var jwt = require('jsonwebtoken');

var bcrypt = require('bcrypt');
var express = require('express');
var app = express();
var status = require('../../stubs/status');
var validateToken = require('../../middleware/JsonToken.js');
var nodemailer = require('nodemailer')
const cryptoRandomString = require('crypto-random-string');

router.get('/me',validateToken, (req, res, next)=>{
    return res.json({
        Message: 'This is a test Route'
    })
})

const selfSignedConfigOptions = {
    host: 'smtp.wedonate.com',
    service: 'gmail',
    port: 465,
    auth: {
        user: 'lets.donate2@gmail.com',
        pass: 'wedonateapp'
    }
};

var transporter = nodemailer.createTransport(selfSignedConfigOptions);


router.post('/forgot_password', (req, res, next)=>{
    var newPassword = cryptoRandomString(8);
    console.log(newPassword);
    console.log(req.body.email);
    bcrypt.hash(newPassword, 10, function(err, hash) {
        // Store hash in database
    console.log(hash);
    User.findOneAndUpdate({'local.email': req.body.email},{$set:{'local.password': hash}}, {new: true},(err, updatedUser)=>{
        if(err){
            return res.json({
                status: false,
                message: "Sorry your request could not be processed. Try again later."
            })
        }
        console.log('Updated User');
        console.log(updatedUser);
        if(!updatedUser){
            return res.json({ 
                success: false, 
                message: 'No Such User Found.'
            });
        }
        //Send email and then response back to user
        var messageOptions = {
            from: 'We-Donate <support@wedonate.com>',
            to: updatedUser.local.email,
            subject: 'Your Password Has Been Reset',
            html: `Hi,<br/>Your new password is ${newPassword}.`
        }
        transporter.sendMail(messageOptions, (err)=>{
            if(err){
                console.log('Forgot Password Email could not be sent')
                console.log(err)
                return res.json({
                    status: false,
                    message: "Sorry your request could not be processed. Try again later."
                })
            }
            return res.json({
                status: true,
                message: "Your password has been reset. Check your email for your new password."
            })
        })
    })
})
})

/*router.post('/change_password/:email', validateToken, (req, res, next)=>{
    req.checkBody('oldPassword', 'Old Password is Required').notEmpty();
    req.checkBody('newPassword1', 'New password is required').notEmpty();
    req.checkBody('newPassword2', 'Confirm New password').notEmpty();
    req.checkBody('newPassword2','New Passwords Do Not Match').equals(newPassword1)

    var errors = req.validationErrors();
    if (errors) {
        return res.json(status.field_missing);
    }

    User.getUserByUsername('',req.body.email,(err, existingUser)=>{
        if(err)
            throw err
        if(!existingUser){
            return res.json({
                Status: false,
                Message: 'User with such email Does not exist' 
            })
        }
        if(existingUser){
            if(existingUser.local.username != req.body.email){
                res.json({
                    Status: false,
                    Message: 'User with such email Does not exist'
                });
            }
            else if(existingUser.local.password != req.body.oldPassword)
                res.json({
                    Status: false,
                    "Message":"Old Password Does Not Match!"
                });
            else if((existingUser.local.username == req.body.email)&&(existingUser.local.password == req.body.oldPassword)){
                //Update the passwords
            }
        }
        else{
            
        }
    })
})

*/
router.post('/signup',(req, res, next)=>{

    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('username', 'Registration Number is Required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
  //  req.checkBody('contactNo', 'contactNumber is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.json(status.field_missing);
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
                //generateToken  // console.log(user.controller)

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
        console.log(user.local.password);
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


/*
jwt.sign({
            email: req.body.email,
        },  'forgot_password', {
            expiresIn: 60*60*24*7
        },(err, token)=>{
            if(err){
                return res.json({
                    status: false,
                    message: "Sorry your request could not be processed. Try again later."
                })
            }
            else{
                var host = req.get('host');
                var link = `https://${host}/verify${token}`;
                var messageOptions = {
                    from: 'We-Donate <clientservice@wedonate.com>',
                    to: updatedUser.local.email,
                    subject: 'Your Password Has Been Reset',
                    html: `Hi,<br/>Please Click on this Link to reset`
                }
            }
        });
*/