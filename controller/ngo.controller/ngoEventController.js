'use strict';
const Events = require('../../models/Ngo/eventSchema');
const Ngo = require('../../models/Ngo/ngo');
const async = require('async');
var jwt = require('jsonwebtoken');


module.exports.postEvent = (req,res) => {
   Events.saveEvent(req.body , (err,saveEvent)=>{

      var response = {
          status : 500,
          message : err
      };
      var id = req.userId;

      if(err){
          res.status(response.status)
              .json(response.message);
      }else {
          // find the data of Ngo from token and
            Ngo.getNGOByNGOname(id ,(err,ngo)=>{
                if(err){
                    res.status(response.status)
                        .json(response.message);
                }else{
                  // send to all NGO subscribers via socket.io
                    async.each(ngo.followers ,(id , callback)=>{
                        // send data here with socket
                        console.log(id);
                        io.emit('chat message', req.body);
                    })
                }

          })

      }
  })

};

module.exports.getEvent = (req,res) =>{

    Events.findEvent( req.params.postId,(err , event)=>{
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