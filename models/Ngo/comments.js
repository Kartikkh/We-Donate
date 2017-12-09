var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({

    comments: {
        type:String
    },
    CommentTime : {
        type : Date,
        default: Date.now
    },
    commentedUser: {
        type: String
    }
});


var commentSchema = mongoose.model('commentSchema',commentSchema );
module.exports = commentSchema;


