var mongoose = require('mongoose');

var commentSchema = require('./comments');
var Schema = mongoose.Schema;

var eventSchema = new Schema({

    authorisedPerson: String,
    post : {
        type: String
    },
    Category:{
      type:String
    },
    location: {
       type: String //Geolocation
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
    time : String ,
    comments:[{
        type: Schema.Types.ObjectId,
        ref: 'commentSchema'
    }],

    created_at: {
        type: Date,
        default: Date.now
    },

    going : {
        type:Number,
        default:0
    },
    interested:{
        type:Number,
        default:0
    },
    like:{
        type:Number,
        default:0
    }

});


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

module.exports.findAll = (callback)=>{
    event.find({} , callback);
}




