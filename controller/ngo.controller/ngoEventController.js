'use strict';
const Events = require('../../models/Ngo/eventSchema');
const Ngo = require('../../models/Ngo/ngo');
const commentSchema = require('../../models/Ngo/comments');


module.exports.postEvent = (req,res,next) => {

    let id = req.userId;

    let event  = new Events({
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

module.exports.getAllEventForNgo = (req,res) =>{

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
           res.status(response.status)
               .json(events);
       }
   })

};



module.exports.getEventDetails = (req,res,next) =>{

    Events
        .findOne({'_id' : req.params.id})
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
            res.status(response.status)
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


