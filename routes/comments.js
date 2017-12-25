// COMMENTS ROUTES



app.get("/blogs/:id/comments/new",isLoggedIn,function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err){
            console.log(err);
        }else
        res.render("comments/new",{blog:blog});
    });
});




app.post("/blogs/:id/comments",isLoggedIn,function(req, res){
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
    