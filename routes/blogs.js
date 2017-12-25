
var express=require("express");
var router=expressRouter();
// router.get('/blogs',function(req,res){
//     res.render('index.ejs');
// });

//INDEX - show all blogs
router.get("/blogs", function(req, res){
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
router.post("/blogs", function(req, res){
    // get data from form and add to blogs array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newBlog = {name: name, image: image, description: desc}
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






router.get("/blogs/new",function(req,res){
    res.render('new.ejs');

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

router.get("/blogs/:id",function(req, res){
    //find the blog with provided ID
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            console.log(foundBlog)
            //render show template with that blog
            res.render("blogs/show", {blog: foundBlog});
        }
    });
});

module.exports= router;