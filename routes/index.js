var express=require("express");
var router=express.Router();
var User=require("../models/user");
var passport=require("passport");


router.get('/',function(req,res){
    res.redirect('/blogs')
})

// show register form
router.get("/register", function(req, res){
   res.render("blogs/register"); 
});
//handle sign up logic
router.post("/register", function(req, res){
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
router.get("/login", function(req, res){
   res.render("blogs/login"); 
});
// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/blogs");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports= router;