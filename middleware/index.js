var Blog = require("../models/blog");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkblogOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundblog){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the blog?
            if(foundblog.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    
    req.flash("error","Please Login First!")
    
    
    
    res.redirect("/login");
}

module.exports = middlewareObj