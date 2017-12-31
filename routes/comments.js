var express=require("express");
var router=express.Router({mergeParams:true});
var Blog=require("../models/blog");
var Comment=require("../models/comment");
var middleware=require("../middleware/index.js")


//New COMMENTS form ROUTES
router.get("/new",middleware.isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            console.log(err);
        }else
        res.render("comments/new",{blog:blog});
    });
});


//Create new comment route

router.post("/",middleware.isLoggedIn,function(req, res){
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

//Comment Edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }
        //Only sending blog id to the edit template as that is all we are going to need
        res.render("comments/edit",{blog_id:req.params.id,comment:foundComment});
        });
});

//Comment Update
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
        
        
        
    });
    
    
    
});


//Delete route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
        
        
        
        
    });
    
    
    
});






  






module.exports= router;