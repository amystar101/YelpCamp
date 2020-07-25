const express = require('express'),
    app = express(),
    bodyparser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    LocalStrategy = require('passport-local'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    methodOverride = require('method-override');
    seedDB = require('./seeds'),
    PORT = 3000;

const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');


mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/yelp_camp_v1',{useNewUrlParser: true, useFindAndModify: false });
app.use(bodyparser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

// passport configuration
app.use(require('express-session')({
    secret : "This is key secret to hack the hash in database",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/',indexRoutes);


app.listen(PORT,function(){
    console.log("Yelpcamp server has started at port "+PORT);
});




