const mongoose = require('mongoose');
const User = require('./../User/user');
const commentSchema = require('./comments');
const Schema = mongoose.Schema;

const eventSchema = new Schema({

    authorisedPerson:{
       type : String
    },

    ngoName : {
        type: String,
        unique: true
    },

    regNo: {
        type: String
    },

    eventName :{
        type: String
    },

    post : {
        type: String
    },

    Category:{
      type:String
    },

    locationName: {
       type: String //Geolocation
    },

    locationCoordinate : {
        type: { type: String },
        coordinates: []
    },

    startDate:{
        type:Date
    },

    endDate:{
        type:Date
    },

    uploadImage:[{
        type: Schema.Types.ObjectId,
        ref: ''
    }],

    contactNo : String,

    comments:[{
        type: Schema.Types.ObjectId,
        ref: 'commentSchema'
    }],

    created_at: {
        type: Date,
        default: Date.now
    },

    going : [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    interested:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    like:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],


});


eventSchema.index({ locationCoordinate : "2dsphere" });

const event = mongoose.model('eventSchema',eventSchema );
module.exports = event;


module.exports.saveEvent = (newEvent , callback)=>{
   newEvent.save(callback);
};

module.exports.findEvent = (id , callback)=>{
    event.findOne(id , callback);
};

module.exports.findEventAndRemove = (id , callback)=>{
    event.findOne(id , callback);
};





