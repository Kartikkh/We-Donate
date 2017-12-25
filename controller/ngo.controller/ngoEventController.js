'use strict';
const Events = require('../../models/Ngo/eventSchema');
const Ngo = require('../../models/Ngo/ngo');
const commentSchema = require('../../models/Ngo/comments');
const User = require('../../models/User/user');

module.exports.postEvent = (req,res,next) => {

    let id = req.userId;

    let event  = new Events({
        eventName : req.body.eventName,
        post :      req.body.description,
        contactNo : req.body.contactNo,
        date :      req.body.date,
        startTime : req.body.startTime,
        endTime :   req.body.endTime,
        regNo  :    id,
        ngoName :   req.ngoName,
        authorisedPerson : req.body.authorisedPerson,
        locationName : req.body.locationName,
        locationCoordinate: {
            type: "Point",
            coordinates: [req.body.longitude, req.body.latitude]
        }
    });

    console.log(event);

    Events.saveEvent(event , (err,saveEvent)=>{

        let response = {
            status : 500,
            message : err
        };

        if(err){
            response.message=err;
            res.status(response.status)
                .json(response.message);
        }else{
              Ngo.getNGOByNGOname(id ,(err,ngo)=>{
                  if(err){
                           res.status(response.status)
                          .json(err);
                  }else{
                         ngo.events.push(saveEvent._id);
                         ngo.save((err)=>{
                            if(err){
                                 res.status(response.status)
                                     .json(response.message);
                            }else{
                                 response.status = 200;
                                 response.message = "Successfully Created";
                                 res.status(response.status)
                                    .json(response.message);
                            }
                        });
                  }
            })
        }
    })
};

module.exports.getAllEventForNgo = (req,res,next) =>{



    Events.find({'regNo' : req.userId}).exec((err,events)=>{

       let response = {
           status : 500,
           message : err
       };

       if(err){
           response.message= err ;
           res.status(response.status)
               .json(response.message);
       }else if(events === null || events === undefined){
           response.status = 200;
           response.message = "Invalid UserId !";
           res.status(response.status)
               .json(response.message);
       }else{
           response.status= 200;
           res.status(response.status)
               .json(events);
       }
   })

};



module.exports.getEventDetails = (req,res,next) =>{
        console.log(req.params.postId);
    Events
        .findOne({'_id' : req.params.postId})
        .populate([
            {
                path: 'comments',
                model: 'commentSchema'
             },

            //Image upload URL's
            // {
            //     path: 'LikedUser',
            //     model: 'User',
            //
            // }

        ]).exec((err,event)=>{

        let response = {
            status : 500,
            message : err
        };

        if(err){
            res.status(response.status)
                .json(response.message);
        }else if(event === null || event === undefined){
            response.status = 200;
            response.message = "Invalid UserId !";
            res.status(response.status)
                .json(response.message);
        }else{
            res.status(200)
                .json(event);
        }
    })
};



module.exports.updateEvent = (req,res,next) =>{

};


module.exports.deleteEvent = (req,res,next) =>{

    Events.findEventAndRemove( req.params.postId,(err , event)=>{
        var response = {
            status : 500,
            message : err
        };

        if(err){
            res.status(response.status)
                .json(response.message);
        }else{
            response.status= 200;
            response.message = "successfully deleted";
            res.status(response.status)
                .json(response.message);
        }

    })

};




/// get Nearest Location

module.exports.nearestLocation = (req,res,next)=>{

    let coordinates = [ req.params.longitude,req.params.latitude];

    let response = {
        status : 500,
        message : "error"
    };

    Events.find({
        locationCoordinate:
            { $near:
                {
                    $geometry: { type: "Point",  coordinates: coordinates },
                    $maxDistance: 500000
                }
            }
    },(err , locations)=>{
        if (err) {
            return  res.status(response.status)
                .json(err);
        }
        if(locations === null || locations === undefined){
            res.status(200).json("Sorry There is No Current Events near you !")
        }else{

            res.status(200)
                .json(locations);
        }
    });

};



// Recent Universal events


module.exports.recentEvents = (req,res,next)=>{

    let response = {
        status : 500,
        message : "error"
    };
    let skip = req.query.page;
    Events.find().sort({created_at :  -1}).skip(skip).limit(10)
        .exec((err , event)=>{
                if(err){
                    res.status(response.status)
                        .json(err);
                }else if(event=== null || event === undefined){
                    response.message= "No Recent Events found";
                    res.status(200)
                        .json(response.message);
                }else{
                    res.status(200)
                        .json(event);
                }
        })



};




module.exports.like = (req,res,next)=>{

    let response = {
        status : 500,
        message : "error"
    };

    let eventId = req.params.eventId;

    User.findById({_id : req.userId},function (err , user) {

        if(err){
            res.status(response.status)
                .json(err);
        }else if(user === null || user === undefined){
            response.message= "Please login again";
            res.status(200)
                .json(response.message);
        }else{
            Events.findById({_id : eventId} ,
                { 'like' : {$in : [user._id] } } ,  { $pull: {'like' : user._id } },
                {new : true, safe : true},
                function (err, likeEvent) {
                    if(err){
                        res.status(response.status)
                            .json(err);
                    }else if(likeEvent === null || likeEvent === undefined){
                        Events.findById({_id : eventId}  ,function (err,event) {
                            if(err){
                                res.status(500)
                                    .json(err);
                            }else{
                                 event.like.push(user._id);
                                 res.status(200).json("Like");
                            }
                        })

                    }else{
                        response.message = "Unlike ";
                        res.status(200).json(response.message);
                    }

                })
        }

    })


};


module.exports.going = (req,res,next)=>{




    let response = {
        status : 500,
        message : "error"
    };

    let eventId = req.params.eventId;

    User.findById({_id : req.userId},function (err , user) {

        if(err){
            res.status(response.status)
                .json(err);
        }else if(user === null || user === undefined){
            response.message= "Please login again";
            res.status(200)
                .json(response.message);
        }else{
            Events.findById({_id : eventId} ,
                { 'going' : {$in : [user._id] } } ,  { $pull: {'going' : user._id } },
                {new : true, safe : true},
                function (err, goingEvent) {
                    if(err){
                        res.status(response.status)
                            .json(err);
                    }else if(goingEvent === null || goingEvent === undefined){
                        Events.findById({_id : eventId}  ,function (err,event) {
                            if(err){
                                res.status(500)
                                    .json(err);
                            }else{
                                event.going.push(user._id);
                                res.status(200).json("Going");
                            }
                        })

                    }else{
                        response.message = "Not Going ";
                        res.status(200).json(response.message);
                    }

                })
        }

    })







};

module.exports.interested = (req,res,next)=>{


    let response = {
        status : 500,
        message : "error"
    };

    let eventId = req.params.eventId;

    User.findById({_id : req.userId},function (err , user) {

        if(err){
            res.status(response.status)
                .json(err);
        }else if(user === null || user === undefined){
            response.message= "Please login again";
            res.status(200)
                .json(response.message);
        }else{
            Events.findById({_id : eventId} ,
                { 'interested' : {$in : [user._id] } } ,  { $pull: {'interested' : user._id } },
                {new : true, safe : true},
                function (err, interestedEvent) {
                    if(err){
                        res.status(response.status)
                            .json(err);
                    }else if(interestedEvent === null || interestedEvent === undefined){
                        Events.findById({_id : eventId}  ,function (err,event) {
                            if(err){
                                res.status(500)
                                    .json(err);
                            }else{
                                event.interested.push(user._id);
                                res.status(200).json("Interested");
                            }
                        })

                    }else{
                        response.message = "Not Interested ";
                        res.status(200).json(response.message);
                    }

                })
        }

    })

};

