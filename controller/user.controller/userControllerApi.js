const express = require('express');
const router = express.Router();
const User = require('../../models/User/user');
const Ngo = require('../../models/Ngo/ngo');

module.exports.followerList = (req,res,next)=>{

    let response = {
        status : 500,
        message : "error"
    };

    User.find({_id: req.userId})
        .populate({
            path: 'followers',
            model: 'Ngo',
            select: 'ngoName regNo coverPic followersCount'
        })
        .exec((err,follower)=>{
            if(err){
                res.status(response.status)
                    .json(err);
            }else if(follower === null || follower === undefined){
                response.message= "No Recent Events found";
                res.status(200)
                    .json(response.message);
            }else{
                res.status(200)
                    .json(event);
            }
        })

};




// Following and UnFollowing API 

module.exports.followNgo = (req,res,next)=>{


    let response = {
        status : 500,
        message : "error"
    };


    User.find({_id : req.userId,
            "follower": { $in: [req.params.ngoId]}
        },
        {
            $pull :{
                'follower':req.params.ngoId
            }
        },{
            new : true,
            safe : true
        },  (err ,  follow)=>{
                if(err){
                    res.status(response.status)
                        .json(err);
                }else if(follow===null || follow=== undefined){
                    User.find({_id:req.userId},
                        {
                            $addToSet: {
                                'follower':req.params.ngoId
                        }
                    }, {
                        new: true
                    },(err, results)=> {
                            if (err) {
                                res.status(500).json(err);
                            }
                            res.json("Followed");
                        })
                }else{
                    res.status(200).json("unFollowed")
                }
            }
        )


};
