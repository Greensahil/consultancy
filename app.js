var express         =   require('express'),
    app             =   express(),
    passport        =   require('passport'),
    LocalStrategy   =   require('passport-local'),
    mongoose        =   require("mongoose"),
    bodyParser      =   require('body-parser'),
    Blog            =   require('./models/blog'),
    User            =   require("./models/user"),
    Comment         =   require("./models/comment"),
    seedDB          =   require("./seeds");
    

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
seedDB();

var url = process.env.DATABASEURL || "mongodb://localhost/consultancy";
mongoose.connect(url);





// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Subha Mishra",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Routes

app.get('/',function(req,res){
    res.redirect('/blogs')
})

// app.get('/blogs',function(req,res){
//     res.render('index.ejs');
// });


//CREATE - add new database to DB
app.post("/blogs", function(req, res){
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




//INDEX - show all blogs
app.get("/blogs", function(req, res){
    // Get all blogs from DB
    Blog.find({}, function(err, blogs){
       if(err){
           console.log(err);
       } else {
          res.render("blogs/index",{blogs:blogs});
       }
    });
});

app.get("/blogs/new",function(req,res){
    res.render('new.ejs');

});

// SHOW - shows more info about one blog
// app.get("/blogs/:id", function(req, res){
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

app.get("/blogs/:id", function(req, res){
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
})



//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function(req, res){
   res.render("blogs/register"); 
});
//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("blogs/register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/blogs"); 
        });
    });
});

// show login form
app.get("/login", function(req, res){
   res.render("blogs/login"); 
});
// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/blogs");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



// COMMENTS ROUTES



app.get("/blogs/:id/comments/new",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            console.log(err);
        }else
        res.render("comments/new",{blog:blog});
    });
});




app.post("/blogs/:id/comments", function(req, res){
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
               blog.comments.push(comment);
               blog.save();
               res.redirect('/blogs/' + blog._id);
           }
        });
       }
   });
 
});
    
    





app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});