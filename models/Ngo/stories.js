var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var stories = new Schema({

    story :{
        type : String,
        required:true
    },
    created_at: {
        type: Date,
        default: Date.now
    },

    image:{

    },

    like:{
        type:Number,
        default:0
    }

});



var Stories = mongoose.model('stories',stories );
module.exports = Stories;