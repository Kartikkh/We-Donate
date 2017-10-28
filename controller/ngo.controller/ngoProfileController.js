const Ngo = require('../../models/Ngo/ngo');
const async = require('async');
const Events = require('../../models/Ngo/eventSchema');

module.exports.getProfile = (req,res) =>{

    Ngo.getNGOByNGOname(req.id,(err,ngo)=>{

        var response = {
            status : 500,
            message : err
        };

        if(err){
            res.status(response.status)
                .json(response.message);
        }else if(ngo===null || ngo === undefined){
            respose.status = 404;
            response.message='No Ngo found';
            res.status(response.status)
                .json(response.message);
        }else{


        }
    })

};



module.exports.updateProfile = (req,res) =>{

};



module.exports.deleteProfile = (req,res) =>{


};
