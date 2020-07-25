const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


router.get('/',function(req,res){
    res.render('landing');
});

// ======= auth routes ===========

//show register form
router.get('/register',function(req,res){
    res.render('register');
});

// sign up logic
router.post('/register',function(req,res){
    let newUser = new User({username : req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash('error',err.message);
            return res.render('register');
        }
        passport.authenticate('local')(req,res,function(){
            req.flash('success',"Welcome to YelpCamp "+user.username);
            res.redirect('/campgrounds');
        });

    });
});

// show login form
router.get('/login',function(req,res){
    res.render('login');
});

// handeling loign logic
router.post('/login',passport.authenticate('local',{
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
    }), function(req,res){
});

// logout
router.get('/logout',function(req,res){
    req.flash('error',"Good Bye "+req.user.username)
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;