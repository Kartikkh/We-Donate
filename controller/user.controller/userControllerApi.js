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
            select: 'ngoName regNo coverPic followersCount tagLine'
        })
        .exec((err,follower)=>{
            if(err){
                res.status(response.status)
                    .json(err);
            }else if(follower === null || follower === undefined){
                response.message= "You Haven't Subscribe to any Ngo's";
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

    let ngoId = req.params.ngoId;

    User.findById({_id : req.userId},function (err , user) {

        if(err){
            res.status(response.status)
                .json(err);
        }else if(user === null || user === undefined){
            response.message= "Please login again";
            res.status(200)
                .json(response.message);
        }else{
            Ngo.findByIdAndUpdate({_id : ngoId ,
                 'followers' : {$in : [user._id] } } ,  { $pull: {'followers' : user._id } },
                {new : true, safe : true},
                function (err, followNgo) {
                if(err){
                    res.status(response.status)
                        .json(err);
                }else if(followNgo === null || followNgo === undefined){
                    Ngo.findByIdAndUpdate({_id : ngoId} , {$push :{'follower' : user._id }}  ,function (err,ngo) {
                        if(err){
                            res.status(500)
                                .json(err);
                        }else{
                            user.followers.push(ngoId);
                            user.save((err)=>{
                                if(err){
                                    res.status(500)
                                        .json(err);
                                }
                            });

                            res.status(200).json("Followed");
                        }
                    })

                }else{
                    response.message = "Unfollowed ";
                    res.status(200).json(response.message);
                }

            })
        }

    })

};


