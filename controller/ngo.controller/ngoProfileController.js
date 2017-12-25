const Ngo = require('../../models/Ngo/ngo');
const async = require('async');
const Events = require('../../models/Ngo/eventSchema');

module.exports.getProfile = (req,res,next) =>{

    Ngo.getNGOByNGOname(req.userId,(err,ngo)=>{
        var response = {
            status : 500,
            message : err
        };

        if(err){
            res.status(response.status)
                .json(response.message);
        }else if(ngo===null || ngo === undefined){
            response.status = 404;
            response.message='No Ngo found';
            res.status(response.status)
                .json(response.message);
        }else{
            res.status(200).json(ngo);
        }
    })

};



module.exports.updateProfile = (req,res,next) =>{

};



module.exports.deleteProfile = (req,res,next) =>{


};



module.exports.viewNgoProfile = (req,res,next) =>{
    let ngoId  = req.params.ngoId;
    Ngo.getNGOByNGOname(ngoId,(err,ngo)=>{
        var response = {
            status : 500,
            message : err
        };

        if(err){
            res.status(response.status)
                .json(response.message);
        }else if(ngo===null || ngo === undefined){
            response.status = 404;
            response.message='No Ngo found';
            res.status(response.status)
                .json(response.message);
        }else{
            res.status(200).json(ngo);
        }
    })


};