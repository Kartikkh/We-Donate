const router = require('express').Router();
const Ngo = require('../../models/ngo.js');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var status  = require('../../stubs/status');
var validateToken = require('../../middleware/JsonToken.js');
var nodemailer = require('nodemailer')
const cryptoRandomString = require('crypto-random-string');

router.get('/about',validateToken, (req, res, next)=>{
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



router.post('/login',(req,res,next)=>{
    var regNo = req.body.username;
    Ngo.findOne(regNo, function (err , result) {
        if(err){
            console.log(err);
        }else if(!result){
            res.json("does not exits")
        }else{
            var passwordIsValid = bcrypt.compareSync(req.body.password, result.password);
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

        }
    });

});

router.post('/signup',(req, res, next)=>{

    req.checkBody('ngoName', 'name is required').notEmpty();
    req.checkBody('regNo', 'Registration Number is Required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('contactNo', 'contactNumber is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return res.json(status.field_missing);
    }

    var verificationToken = cryptoRandomString(25);

    var newNgo = new Ngo({
        ngoName : req.body.ngoName,
        regNo : req.body.regNo,
        email : req.body.email,
        password : req.body.password,
        contactNo : req.body.contactNo,
        location : {
            country: req.body.country,
            state:req.body.state,
            city:req.body.city
        },
        authenticationSecret:verificationToken,
        address :req.body.address

    });



    Ngo.find( req.body.regNo , function(err , exits){
        console.log(exits);
        if(err){
            res.json(error);
        }else if( req.body.regNo =exits.regNo ){
            res.json("exits");
        }else{
            console.log("there");
            Ngo.createNgo(newNgo,(err,ngo)=>{
                if(err)
                    throw err;
                else{

                    var host = req.get('host');
                    var link = `https://${host}/NgoAuth/verify/${verificationToken}`;
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
                            console.log(err)
                            return res.json({
                                status: false,
                                message: "You have Signed-Up successfully, but Verification Email could not be Sent. Try again later."
                            });
                        }
                        return res.json({
                            status: true,
                            message: "Registered Successfully. Please confirm your account by following the link in the email."
                        })
                    })


                }
            })

        }
    })
});




router.get('/verify/:verificationToken', (req, res, next)=>{
    Ngo.findOneAndUpdate({'authenticationSecret': req.params.verificationToken}, {$set: {'authentication': true}}, {new: true}, (err, ngo)=>{
        if(err){
            return res.status(status.dbError.response_code).send(status.dbError.reason);
        }
        else{
            return res.status(200).send({'Message': 'You successfully verified your account. You can login now.'});
        }
    })
});

router.post('/resend_email', (req, res, next)=>{
    Ngo.findOne({'email': req.body.email}, (err, ngo)=>{
        if(err){
            return res.status(status.dbError.response_code).send(status.dbError.reason)
        }
        var host = req.get('host');
        var link = `https://${host}/NgoAuth/verify/${ngo.authenticationSecret}`;
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
                    message: "Please Try again later."
                })
            }
            return res.json({
                status: true,
                message: "Verification Email Sent to your Email Successfully. Please confirm your account by following the link in the email."
            })
        })
    })
});


router.post('/changePassword',(req,res,next)=>{

    req.checkBody('regNo', 'Registration Number is Required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('oldPassword', 'Old Password is required').notEmpty();
    req.checkBody('newPassword', 'New Password is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return res.json(status.field_missing);
    }
    Ngo.findOne({'regNo': req.body.regNo, 'email':req.body.email},(err,ngo)=>{
        if(err){
                 res.json(status.wrong_field);
        }
        else if(ngo.email !== req.body.email){
                res.json(status.email);
        }
        else if(ngo.regNo !== req.body.regNo){
                res.json(status.RegNo);
        }else{
            if(!bcrypt.compareSync(req.body.oldPassword, ngo.password)){
                res.json({
                    Status: false,
                    "Message":"Old Password Does Not Match!"
                });
            }else{

                hash = bcrypt.hashSync(req.body.newPassword1,10);
                ngo.password = hash;
                console.log('Saved hash to Ngo');
                existingUser.save((err, Updatedngo)=>{
                    if(err){
                        return res.status(status.dbError.response_code).send(status.dbError.reason);
                    }
                    else{
                        return res.json({'Message': 'Your Password has been changed'});
                    }
                })

            }
        }



    });



});



// Forgot Password API

router.post('/forgot_password', (req, res, next)=>{
    var newPassword = cryptoRandomString(8);
    console.log(newPassword);
    Ngo.getNgoByEmail(req.body.email,(err,ngo)=>{
        if(err){
            res.json(status.dbError);
        }else{
            var host = req.get('host');
            var link = `https://${host}/NgoAuth/ForgotPassword/${ngo.authenticationSecret}`;
            var messageOptions = {
                from: 'We-Donate <support@wedonate.com>',
                to: user.local.email,
                subject: 'Please Confirm Your Account For change Password Request',
                html: `Hi,<br/>Thanks for registering with us. Please confirm your account by following this <a href="${link}">LINK</a>.`
            }
            transporter.sendMail(messageOptions, (err)=>{
                if(err){
                    return res.json({
                        status: false,
                        message: "Please Try again later."
                    })
                }
                return res.json({
                    status: true,
                    message : "Forgot Password Link has been sent to your Registered Email ID ! Please Click on that in order to Change Password"
                  })
            })
        }
    });
});





module.exports = router;