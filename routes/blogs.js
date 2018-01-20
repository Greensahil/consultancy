var express = require("express");
var router  = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware");
var passport =require("passport");


//INDEX - show all blogs
router.get("/", function(req, res){
    // Get all blogs from DB
    Blog.find({}, function(err, allblogs){
       if(err){
           console.log(err);
       } else {
          res.render("blogs/index",{blogs:allblogs});
       }
    });
});


router.get("/google",passport.authenticate("google",{
    scope:["profile"]
    
})
);

//callback route for google to redirect to
router.get("/google/redirect",function(req,res){
    res.send("You reached the callback URI")
    
    
})




//CREATE - add new blog to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to blogs array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var subdes=req.body.subdescription;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newblog = {name: name, image: image,subdescription:subdes, description: desc, author:author}
    // Create a new blog and save to DB
    Blog.create(newblog, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to blogs page
            console.log(newlyCreated);
            res.redirect("/blogs");
        }
    });
});

//NEW - show form to create new blog
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("blogs/new"); 
});

// SHOW - shows more info about one blog
router.get("/:id", function(req, res){
    //find the blog with provided ID
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundblog){
        if(err){
            console.log(err);
        } else {
            console.log(foundblog)
            //render show template with that blog
            res.render("blogs/show", {blog: foundblog});
        }
    });
});

// EDIT blog ROUTE
router.get("/:id/edit", middleware.checkblogOwnership, function(req, res){
    Blog.findById(req.params.id, function(err, foundblog){
        res.render("blogs/edit", {blog: foundblog});
    });
});

// UPDATE blog ROUTE
router.put("/:id",middleware.checkblogOwnership, function(req, res){
    // find and update the correct blog
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog){
       if(err){
           res.redirect("/blogs");
       } else {
           //redirect somewhere(show page)
           res.redirect("/blogs/" + req.params.id);
       }
    });
});

// DESTROY blog ROUTE
router.delete("/:id",middleware.checkblogOwnership, function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs");
      }
   });
});


module.exports = router;

