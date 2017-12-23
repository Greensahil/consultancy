var mongoose = require("mongoose");
var Blog = require("./models/blog");
var Comment   = require("./models/comment");

var data = [
    {
        name: "5 basic tips for interview", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "The most common question that arises in the minds of the ones who are preparing for their US visa interviews is, How should I prepare myself for the interview and what are the things I need to know?One of the important steps in the process of applying for a US visa is the visa interview. Visa applicants need to be aware of a few things in order to successfully get through these interviews."
    },
    {
        name: "Interview", 
        image: "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg",
        description: "The most common question that arises in the minds of the ones who are preparing for their US visa interviews is, How should I prepare myself for the interview and what are the things I need to know?One of the important steps in the process of applying for a US visa is the visa interview. Visa applicants need to be aware of a few things in order to successfully get through these interviews."
    },
    {
        name: "Interview location", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "The most common question that arises in the minds of the ones who are preparing for their US visa interviews is, How should I prepare myself for the interview and what are the things I need to know?One of the important steps in the process of applying for a US visa is the visa interview. Visa applicants need to be aware of a few things in order to successfully get through these interviews."
    }
]

function seedDB(){
   //Remove all campgrounds
   Blog.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
         //add a few campgrounds
        data.forEach(function(seed){
            Blog.create(seed, function(err, blog){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "I love this website",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                blog.comments.push(comment);
                                blog.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
