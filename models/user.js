var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
   local:{
    username: String,
    password: String,

},facebook:{
    id:String,
    username:String,
    token:String,
    email:String,
    name:String
},google:{
    username: String,
    password: String,
    id:String
}
    
});




UserSchema.plugin(passportLocalMongoose);

// generating a hash


module.exports = mongoose.model("User", UserSchema);