const router = require('express').Router();
const Ngo = require('../../models/ngo.js');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var status  = require('../../stubs/status');
var validateToken = require('../../middleware/JsonToken.js');

router.get('/about',validateToken, (req, res, next)=>{
    return res.json({
        Message: 'This is a test Route'
    })
})

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
                jwt.sign({
                    ngoName: req.body.ngoName,
                }, 'tokenbasedAuthentication', {
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


module.exports = router;