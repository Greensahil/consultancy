const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('./keys');
const User=require("../models/user")


passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(function(user) {
        done(null, user);
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
        User.findOne({'google.id': profile.id}).then((currentUser) => {
            if(currentUser){
                // // already have this user
                // console.log('user is: ', currentUser);
                done(null,currentUser);
                // do something
        }else{
            //create a new user
        new User ({
            'google.username':profile.displayName,
            'google.id':profile.id
        }).save().then(function(newUser){
            console.log("New user created"+newUser)
            done(null,newUser);
        });
            
            
        }
        
        
    })
      
    }));


//FACEBOOK




passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: 'https://mcd-sahilgreen.c9users.io/blogs/facebook/redirect'
  },
  function(accessToken, refreshToken, profile, done){
    //check if the user already exists
        User.findOne({'facebook.id': profile.id}).then((currentUser) => {
            if(currentUser){
                // // already have this user
                console.log('user is: ', currentUser);
                done(null,currentUser);
                // do something
        }else{
            //create a new user
        new User({
            'facebook.username':profile.displayName,
            'facebook.id':profile.id
        }).save().then(function(newUser){
            console.log("New user created"+newUser)
            done(null,newUser);
        });
            
            
        }
        
        
    })
  }));