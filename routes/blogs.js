var express=require("express");
var router=express.Router();
var Blog=require("../models/blog");


//INDEX - show all blogs
router.get("/", function(req, res){
    // Get all blogs from DB
    Blog.find({}, function(err, blogs){
       if(err){
           console.log(err);
       } else {
          res.render("blogs/index",{blogs:blogs, currentUser:req.user});
       }
    });
});
//CREATE - add new database to DB
router.post("/",isLoggedIn,function(req, res){
    // get data from form and add to blogs array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
     var author={
        id:req.user._id,
        username:req.user.username
    };
    var newBlog = {name: name, image: image, description: desc,author};
    // Create a new blog and save to DB
    Blog.create(newBlog, function(err, newlyCreated){
        
        if(err){
            console.log(err);
        } else {
            //redirect back to blogs page
            res.redirect("/blogs");
        }
    });
});






router.get("/new",isLoggedIn,function(req,res){
    res.render('blogs/new');

});

// SHOW - shows more info about one blog
// router.get("/blogs/:id", function(req, res){
//     //find the blog with provided ID
//     Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
//         if(err){
//             console.log(err);
//         } else {
//             console.log('foundBlog')
//             //render show template with that blog
//             res.render("show", {blog: foundBlog});
//         }
//     });
// });

router.get("/:id",function(req, res){
    //find the blog with provided ID
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            //render show template with that blog
            res.render("blogs/show", {blog: foundBlog});
        }
    });
});


//EDIT blog route
router.get("/:id/edit",function(req,res){
    //Checking is the user is logged in
     if (req.isAuthenticated()){
        Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            //Checking if the user owns the blog
            if(foundBlog.author.id.equals(req.user._id)){
                res.render("blogs/edit",{blog:foundBlog});
            }
            else{
                 res.send("You do not have permission to do that")
            }
            
        }
         res.render("blogs/edit",{blog:foundBlog});
    });
         
     }

    
    

});






//UPDATE blog route

router.put("/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
        
    });
    
});


//DESTROY route
router.delete(":/id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else
            res.redirect("/blogs");
        
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