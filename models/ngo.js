var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var NgoSchema = new Schema({
    ngoName : {
        required: true,
        type: String,
        unique: true
    },
    regNo:{
        required: true,
        type: String,
    },
    authorisedPerson: String,
    description : {
        type: String
    },
    address : String,
    location: {
        country: {
            type: String
        },
        state:{
            type:String
        },
        city:{
            type:String,

        }
    },
    authentication :{
        type:Boolean,
        default : false
    },
    authenticationSecret: {
        type: String
    },
    coverPic:[{
        type: Schema.Types.ObjectId,
        ref: ''
    }],
    events:[{
        type: Schema.Types.ObjectId,
        ref: ''
    }],
    email:{
        type: String, //unique
        required: true,
        lowercase: true,
    },
    contactNo : String,
    website: {
        url: {
            type: String
        }
    },
    password: {
        type: String,
    },
    stories:[{
        type: Schema.Types.ObjectId,
        ref: ''
    }],
    fundRaised:{
        type:Number
    },
    created_at: {
        type: Date,
    },
    socialLinks: {
        facebook: {
            type: String
        },
        twitter: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    followersCount : {
        type:Number,
        default:0
    }

});


var Ngo = mongoose.model('NgoSchema',NgoSchema );
module.exports = Ngo;

module.exports.createNgo = (newNgo, callback)=>{
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newNgo.password, salt, function(err, hash) {
            // Store hash in your password DB.
            newNgo.password = hash
            // console.log(hash)
            newNgo.save(callback)
        });
    });
};

module.exports.getNGOByNGOname = (regNo, callback)=>{
    Ngo.findOne(regNo, callback)
};

module.exports.getUserById = (id, callback)=>{
  Ngo.findById(id, callback)
};
module.export.getNgoByEmail=(email,callback)=>{
  Ngo.findOne({'email':email},callback)
};


