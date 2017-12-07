var express= require('express'),
     app=   express(),
    mongoose=require("mongoose"),
    bodyParser= require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
mongoose.connect("mongodb://localhost/usvisa");



// database
// Mongoose/Model Config
var blogSchema= new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);



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


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});