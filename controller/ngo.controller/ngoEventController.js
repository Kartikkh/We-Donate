'use strict';
const Events = require('../../models/Ngo/eventSchema');
const Ngo = require('../../models/Ngo/ngo');
const commentSchema = require('../../models/Ngo/comments');


module.exports.postEvent = (req,res) => {



    var id = req.userId;

    var event  = new Events({
        post :      req.body.description,
        contactNo : req.body.contactNo,
        date :      req.body.date,
        startTime : req.body.startTime,
        endTime :   req.body.endTime,
        regNo  :    id,
        ngoName :   req.ngoName,

    });

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
                          .json(response.message);
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



modules.exports.getEventDetails = (req,res) =>{

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



module.exports.updateEvent = (req,res) =>{

};


module.exports.deleteEvent = (req,res) =>{

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

module.exports.nearestLocation = (req,res)=>{

    let coordinates = [req.params.longitude, req.params.latitude];
    let limit = req.query.limit || 10;
    let maxDistance = req.query.distance || 8;
    maxDistance /= 6371;

    var response = {
        status : 500,
        message : err
    };

    Events.find({
        locationCoordinate: {
            $near:coordinates ,
            $maxDistance: maxDistance
        }
    }).limit(limit).exec(function(err, locations) {
        if (err) {
            return  res.status(response.status)
                .json(response.message);
        }
        res.status(200)
            .json(locations);
    });



};


