var express= require('express'),
    app=   express(),
    passport=require('passport'),
    LocalStrategy=require('passport-local'),
    mongoose=require("mongoose"),
    bodyParser= require('body-parser'),
    User        = require("./models/user");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

var url = process.env.DATABASEURL || "mongodb://localhost/consultancy";
mongoose.connect(url);



// database
// Mongoose/Model Config
var blogSchema= new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);


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
    // Get all campgrounds from DB
    Blog.find({}, function(err, blogs){
       if(err){
           console.log(err);
       } else {
          res.render("index",{blogs:blogs});
       }
    });
});

app.get("/blogs/new",function(req,res){
    res.render('new.ejs');

});

// SHOW - shows more info about one campground
app.get("/blogs/:id", function(req, res){
    //find the campground with provided ID
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", {blog: foundBlog});
        }
    });
})

//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/blogs"); 
        });
    });
});

// show login form
app.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function(req, res){
});

// logic route
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


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});