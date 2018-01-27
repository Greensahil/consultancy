//add this file to gitignore

module.exports={
    google:{
        clientID:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET
     },
    mongodb:{    
        dbURI:"mongodb://sahilgreen:Sahil12345@ds133876.mlab.com:33876/consultancy"
        
    },
    
    facebook:{
        clientID:process.env.FACEBOOK_ID,
        clientSecret:process.env.FACEBOOK_SECRET,
        callbackURL: 'https://mcd-sahilgreen.c9users.io/blogs/facebook/redirect'

        
        
    }
    
    
};

