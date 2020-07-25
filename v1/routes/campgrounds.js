const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');


// campgrounds route

// show route
router.get('/',function(req,res){
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log("we found err in quering in db here");
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{
                campgrounds: allcampgrounds,
            });
        }
    });
});

// add new 
router.post('/', middleware.isLoggedIn,function(req,res){
    let newcampground = {
        name: req.body.name,
        price : req.body.price,
        image: req.body.image,
        description : req.body.description,
        author :{
            id : req.user._id,
            username : req.user.username
        }
    };
    Campground.create(newcampground,function(err,newlyadded){
        if(err){
            console.log(err);
        }
        else{
            req.flash('success',"Campground Added");
            res.redirect('/campgrounds');
        }
    });
});

// add new capmground form
router.get('/new',middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

// show particular campground
router.get("/:id",function(req,res){
    // display details about th ecampground with id = id
    Campground.findById(req.params.id).populate('comments').exec(function(err,foundcampground){
        if(err)
            console.log(err);
        else{
            res.render("campgrounds/show",{
                campground : foundcampground
            });
        }
    });
});

// edit campground
router.get('/:id/edit',middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundcampground){
        if(err){
            req.flash('error',"Campground not found");
            res.redirect('/campgrounds');
        }
        else{
            res.render("campgrounds/edit",{
                campground : foundcampground
            });
        }
    });
});

// update campground
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampgrund){
        if(err){
            req.flash('error',"Campground not found");
            res.redirect('/campgrounds');
        }
        else{
            req.flash('success',"Successfully edited the Campground");
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

// distroy campground
router.delete('/:id',middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err,removedCampground){
        if(err){
            req.flash('error',"Campground not found");
            res.redirect("/campgrounds");
        }
        else{
            // delete the comments before redirecting.
            Comment.deleteMany({_id:{$in : removedCampground.comments}},function(err){
                if(err){
                    req.flash('error',"Campground not found");
                    res.redirect('back');
                }
                else{
                    req.flash('success',"Successfully Deleted the Campground");
                    res.redirect('/campgrounds');
                }
            });
        }
    });
});



module.exports = router;