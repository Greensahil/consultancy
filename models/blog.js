// database
// Mongoose/Model Config

var mongoose = require("mongoose");

var blogSchema= new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

module.exports = mongoose.model("Blog", blogSchema);
