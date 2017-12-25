var express         =   require('express'),
    app             =   express(),
    passport        =   require('passport'),
    LocalStrategy   =   require('passport-local'),
    mongoose        =   require("mongoose"),
    bodyParser      =   require('body-parser'),
    Blog            =   require('./models/blog'),
    User            =   require("./models/user"),
    Comment         =   require("./models/comment"),
    seedDB          =   require("./seeds"),
    blogRoutes      =   require("./routes/blogs"),
    commentRoutes   =   require("./routes/comments"),
    indexRoutes      =  require("./routes/index");
    

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(__dirname + "/public"));
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

app.use(function(req,res,next){
    res.locals.currentUser=req.user,
    next();
});

app.use(indexRoutes);
app.use(blogRoutes);
app.use(commentRoutes);







app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});