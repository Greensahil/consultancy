var Blog = require("../models/blog");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkblogOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundblog){
           if(err){
               req.flash("error","Blog not found");
               res.redirect("back");
           }  else {
               // does user own the blog?
            if(foundblog.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error","You do not have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               req.flash("error","Comment not found");
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error","You do not have permission to do that")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error","You need to be logged in to do that")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;