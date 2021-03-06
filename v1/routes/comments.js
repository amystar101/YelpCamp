const express = require('express');
const router = express.Router({mergeParams : true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// comments new
router.get('/new',middleware.isLoggedIn,function(req,res){

    Campground.findById(req.params.id,function(err,campground){
        if(err){
            req.flash('error',"Somthing went worng");
            console.log(err);
            res.redirect('back');
        }
        else{
            res.render('comments/new',{
                campground : campground
            });
        }
    });
});

// comments create
router.post('/',middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            req.flash('error',"Somthing went worng");
            console.log(err);
            res.redirect('/');
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    req.flash('success',"Succesfully added comment");
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+req.params.id);
                }
            });
        }
    });
});


// edit comment
router.get('/:comment_id/edit',middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err)
            res.redirect('back');
        else{
            res.render("comments/edit",{
                campgroundId : req.params.id,
                comment : foundComment
            });
        }
    });
});

// update comment
router.put('/:comment_id',middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err)
            res.redirect('back');
        else{
            req.flash('success',"Succesfully Edited the comment");
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

// comments distroy routes
router.delete('/:comment_id',middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err)
            res.redirect('back');
        else{
            req.flash('success',"Succesfully Deleted the comment");
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});


module.exports = router;