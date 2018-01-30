var express=require("express");
var router=express.Router();
var User=require("../models/user");
var passport=require("passport");


router.get('/',function(req,res){
    res.redirect('/blogs');
});

// show register form
router.get("/register", function(req, res){
   res.render("blogs/register", {message:req.flash("error")}); 
});
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
        if (req.body.adminCode==="secret82"){
            newUser.isAdmin=true;
    }
    if (newUser.isAdmin===true){
            
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error",err.message);
            return res.render("blogs/register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success","Welcome to USVIT " + user.username);
           res.redirect("/blogs"); 
        });
    });
    }else{
        req.flash("error","You must have admin's permission to signup");
        res.redirect("/register");
    }
});

// show login form
router.get("/login", function(req, res){
    res.render("blogs/login",{message:req.flash("error")}); 
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
    req.flash("success","Logged You Out!");
   res.redirect("/blogs");
});



//GOOGLE SIGNUP AND SIGNIN




// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
//      req.flash("error", "You need to be logged in to do that");
// }




module.exports= router;