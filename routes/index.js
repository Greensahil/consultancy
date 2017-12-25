
app.get('/',function(req,res){
    res.redirect('/blogs')
})

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
