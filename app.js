var express         =   require('express'),
    app             =   express(),
    passport        =   require('passport'),
    LocalStrategy   =   require('passport-local'),
    methodOverride  =   require("method-override"),
    flash           =   require("connect-flash"),
    mongoose        =   require("mongoose"),
    bodyParser      =   require('body-parser'),
    Blog            =   require('./models/blog'),
    User            =   require("./models/user"),
    Comment         =   require("./models/comment"),
    seedDB          =   require("./seeds");
    
    
require('dotenv').config();     // Environment Variables
    
//ROUTES    
    
var blogRoutes      =   require("./routes/blogs"),
    commentRoutes   =   require("./routes/comments"),
    indexRoutes     =   require("./routes/index"),
    passportSetup   =   require("./config/passport-setup"),
    keys            =   require("./config/keys"),
    cookieSession  =    require("cookie-session");
    
    
  





  

app.use(flash()); // use connect-flash for flash messages stored in session

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(__dirname + "/public"));



app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,        //Cookie takes one day to expire
    keys: [process.env.HASH_KEY]            //HASH is an environemnt variable
}));


// seedDB(); //Seed the database

var url =process.env.DATABASEURL||"mongodb://localhost/consultancy";
mongoose.connect(url);





//PASSPORT CONFIGURATION
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

app.use(function(req,res,next){
    res.locals.currentUser=req.user,
    res.locals.error = req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/blogs",blogRoutes);
app.use("/blogs/:id/comments",commentRoutes);







app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});
