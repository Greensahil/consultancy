const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User=require("../models/user")


passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(user){
        done(null,user);
    });
});



passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: 'https://mcd-sahilgreen.c9users.io/blogs/google/redirect'
    }, function(accessToken, refreshToken, profile, done){
    //check if the user already exists
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null,currentUser);
                // do something
        }else{
            //create a new user
        new User({
            username:profile.displayName,
            googleId:profile.id
        }).save().then(function(newUser){
            console.log("New user created"+newUser)
            done(null,newUser);
        });
            
            
        }
        
        
    })
      
    })
);