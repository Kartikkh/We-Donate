const router = require('express').Router();
var User  = require('../../models/User/user');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');
var express = require('express');
var app = express();
var status = require('../../stubs/status');
var validateToken = require('../../middleware/JsonToken.js');

const cryptoRandomString = require('crypto-random-string');



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


router.post('/change_password', validateToken, (req, res, next)=>{
    /*console.log("Checking for Validation Errors");
    req.checkBody('oldPassword', 'Old Password is Required').notEmpty();
    req.checkBody('newPassword1', 'New password is required').notEmpty();
    req.checkBody('newPassword2', 'Confirm New password').notEmpty();
    req.checkBody('newPassword2','New Passwords Do Not Match').equals(newPassword1)
    var errors = req.validationErrors();
    if (errors) {
        return res.json(status.field_missing);
    }
    console.log("No Validation Errors");
    */
    //User details can be obtained by querying mongodb using email in req.decoded.email
    User.getUserByUsername('',req.decoded.email,(err, existingUser)=>{
        if(err)
            throw err
        if(!existingUser){
            return res.json({
                Status: false,
                Message: 'User with such email Does not exist'
            })
        }
        if(existingUser){
            console.log("User Found!!!");
            console.log(req.body.oldPassword);
            console.log(existingUser.local.password)
            if(!bcrypt.compareSync(req.body.oldPassword, existingUser.local.password)){
                console.log("new and Old Passwords Match");
                res.json({
                    Status: false,
                    Message:"Old Password Does Not Match!"
                });
            }
            else {
                //Update the passwords
                hash = bcrypt.hashSync(req.body.newPassword1,10);
                existingUser.local.password = hash;
                console.log('Saved hash to existingUser.local.password');
                existingUser.save((err, updatedUser)=>{
                    if(err){
                        return res.status(status.dbError.response_code).send(status.dbError.reason);
                    }
                    else{
                        return res.json({'Message': 'Your Password has been changed'});
                    }
                })
            }
        }
    })
})

router.post('/signup',(req, res, next)=>{

    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('username', 'Registration Number is Required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    //  req.checkBody('contactNo', 'contactNumber is required').notEmpty();
    console.log(req.body);
    var errors = req.validationErrors();
    if (errors) {
        return res.json(status.field_missing);
    }
    var verificationToken = cryptoRandomString(25);
    var name = req.body.name,
        username = req.body.username,
        email = req.body.email,
        password = req.body.password;
    var newUser = new User({
        local: {
            name: name,
            email: email,
            password: password,
            username: username,
            verificationToken: verificationToken
        },
        facebook: {

        }
    });
    User.getUserByUsername(username,email,(err, existingUser)=>{
        if(err)
            throw err
        console.log('EXISTING USER '+existingUser)
        if(existingUser){
            if(existingUser.local.username == username){
                res.json("Username Already exits");
            }
            else
                res.json(
                    "Email Already exits"
                );
        }
        else{
            User.createUser(newUser,(err,user)=>{
                if(err){
                    return res.status(status.dbError.response_code).send(status.dbError.reason);
                }
                var host = req.get('host');
                var link = `https://${host}/userAuth/verify/${verificationToken}`;
                console.log(link);
                var messageOptions = {
                    from: 'We-Donate <support@wedonate.com>',
                    to: user.local.email,
                    subject: 'Please Confirm Your Account',
                    html: `Hi,<br/>Thanks for registering with us. Please confirm your account by following this <a href="${link}">LINK</a>.`
                }
                transporter.sendMail(messageOptions, (err)=>{
                    if(err){
                        console.log('Verification Email could not be sent');
                        console.log(err);
                        return res.json(
                             "You have Signed-Up successfully, but Verification Email could not be Sent. Try again later."
                        )
                    }
                    return res.json({
                        status: true,
                        message: "Registered Successfully. Please confirm your account by following the link in the email."
                    })
                })
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
            return res.json({ success: false, message: 'Authentication failed. User not found.'});
        console.log(user.local.password);
        //Check if Account is Verified or not
        console.log('Verification Status '+user.local.isVerified);
        if(user.local.isVerified){
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.local.password);
            if (!passwordIsValid) return res.json({  token: null, message:'Your password is invalid!' });
            jwt.sign({
                username: user._id,
                email: user.local.email,

            },   process.env.secretKey, {
                expiresIn: 60*2
            },(err, token)=>{
                if(err){
                    throw err;
                }
                else{
                    res.json({
                        'token' : token ,
                        user : user
                    })
                }
            });
        }
        else{
            return res.json({message: 'First Verify Your Account'});
        }
    });

});

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

router.get('/verify/:verificationToken', (req, res, next)=>{
    User.findOneAndUpdate({'local.verificationToken': req.params.verificationToken}, {$set: {'local.isVerified': true}}, {new: true}, (err, user)=>{
        if(err){
            return res.status(status.dbError.response_code).send(status.dbError.reason);
        }
        else{
            return res.status(200).send({'Message': 'You successfully verified your account. You can login now.'});
        }
    })
})

router.post('/resend_email', (req, res, next)=>{
    User.findOne({'local.email': req.body.email}, (err, user)=>{
        if(err){
            return res.json({message: "Please Try again Later !"});
        }
        if(user===null || user===undefined){
            return res.json({message: " You need to Register first !",
                status : false
            })
        }
        var host = req.get('host');
        var link = `https://${host}/userAuth/verify/${user.local.verificationToken}`;
        console.log(link);
        var messageOptions = {
            from: 'We-Donate <support@wedonate.com>',
            to: user.local.email,
            subject: 'Please Confirm Your Account',
            html: `Hi,<br/>Thanks for registering with us. Please confirm your account by following this <a href="${link}">LINK</a>.`
        }
        transporter.sendMail(messageOptions, (err)=>{
            if(err){
                return res.json({
                    status: false,
                    message: "You have Signed-Up successfully, but Verification Email could not be Sent. Try again later."
                })
            }
            return res.json({
                status: true,
                message: "Verification Email Sent to your Email Successfully. Please confirm your account by following the link in the email."
            })
        })
    })
})

module.exports = router;