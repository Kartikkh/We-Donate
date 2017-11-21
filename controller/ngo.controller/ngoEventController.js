'use strict';
const Events = require('../../models/Ngo/eventSchema');
const Ngo = require('../../models/Ngo/ngo');



module.exports.postEvent = (req,res) => {

    console.log(req.body);

    var event  = new Events({
        post : req.body.description,
        contactNo :req.body.contactNo,
        date : req.body.date,
        startTime : req.body.startTime,
        endTime : req.body.endTime
    });

    Events.saveEvent(event , (err,saveEvent)=>{


        var response = {
            status : 500,
            message : err
        };
        var id = req.userId;
        console.log(id);

        if(err){
            res.status(response.status)
                .json(response.message);
        }else {
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

    Events.findAll((err , event)=>{
        var response = {
            status : 500,
            message : err
        };

        if(err){
            res.status(response.status)
                .json(response.message);
        }else{
            response.status= 200;
            response.message = event;
            res.status(response.status)
                .json(response.message);
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