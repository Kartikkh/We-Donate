var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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


    created_at: {
        type: Date,
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


var event = mongoose.model('eventSchema',eventSchema );
module.exports = event;




