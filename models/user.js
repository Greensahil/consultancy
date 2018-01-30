var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
   local:{
    username: String,
    password: String,
    isAdmin: {type:Boolean , default:false }

}
});




UserSchema.plugin(passportLocalMongoose);

// generating a hash


module.exports = mongoose.model("User", UserSchema);