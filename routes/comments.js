var express=require("express");
var router=express.Router({mergeParams:true});
var Blog=require("../models/blog");
var Comment=require("../models/comment");


//New COMMENTS form ROUTES
router.get("/new",isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            console.log(err);
        }else
        res.render("comments/new",{blog:blog});
    });
});


//Create new comment route

router.post("/",isLoggedIn,function(req, res){
   //lookup blog using ID
   Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
           res.redirect("/blogs");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.username=req.user.username;
               comment.author.id=req.user._id;
               //save comment
               comment.save()
               blog.comments.push(comment);
               blog.save();
               res.redirect('/blogs/' + blog._id);
           }
        });
       }
   });
 
});


//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
    

module.exports= router;