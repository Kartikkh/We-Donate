const express = require('express');
const router = express.Router();
const User = require('../../models/User/user');
const Ngo = require('../../models/Ngo/ngo');
const Event= require('../../models/Ngo/eventSchema');


module.exports.followedEvent = (req,res,next)=>{


    User.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.userId) } },
        { $unwind: { path: "$followers" } },
        { $lookup: { from: 'Ngo', localField: 'followers', foreignField: '_id', as: 'followers' } },
        { $unwind: { path: "$followers" } },
        { $unwind: { path: "$followers.events" } },
        { $lookup: { from: 'Event', localField: 'followers.events', foreignField: '_id', as: 'followers.events' } },
        { $unwind: { path: "$followers.events" } },
        { $sort: { "followers.events.createdDate": -1} },
        // {
        //     $project: {
        //         _id: "$followers.events._id",
        //
        //     }
        // }
    ], function (err, events, next) {
        let response = {
            status : 500,
            message : "error"
        };
        if(err){
            res.status(response.status)
                .json(err);
        } if(events === null || events === undefined){
            response.message= "No Event Found";
            res.status(200)
                .json(err);
        }else{
            res.status(200).json(events)
        }


    });





};



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


module.exports.like = (req,res,next)=>{

    // User.findById({_id : req.userId} , {'flag': 1} , (err , like)=>{
    //     if(err){
    //
    //     }else if(like === null || like === undefined){
    //
    //     }else{
    //
    //     }
    //
    // })





};


module.exports.going = (req,res,next)=>{


};


module.exports.interested = (req,res,next)=>{


};

