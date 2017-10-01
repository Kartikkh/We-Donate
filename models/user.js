var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var Schema = mongoose.Schema

var userSchema = new Schema({
      local: {
          username: {
            type: String
          },
          email: {
            type: String
          },
          name: {
            type: String
          },
          password: {
            type: String
          },
          location: {
            city: String,
            state: String,
            country: String
          }
      },
      facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
        photo: String //Added New
      }
    })

var User = mongoose.model('User',userSchema)
module.exports = User

module.exports.createUser = (newUser, callback)=>{
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.local.password, salt, function(err, hash) {
        // Store hash in your password DB. 
        newUser.local.password = hash
        // console.log(hash)
        newUser.save(callback)
    });
});
}

module.exports.getUserByUsername = (username, email, callback)=>{
  User.findOne({$or: [{'local.username': username}, {'local.email': email}]}, callback)
}

module.exports.getUserById = (id, callback)=>{
  User.findById(id, callback)
}


module.exports.comparePassword = (pass1,pass2,callback)=>{
  bcrypt.compare(pass1, pass2, (err, isMatch)=>{
    if(err)
      throw err
    callback(null, isMatch)
  })
}
