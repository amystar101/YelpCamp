// all the middleware goes here
const Campground = require('../models/campground');
const Comment = require('../models/comment');

let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                req.flash('error',"Campground Not found or Database error. Try after some time");
                res.redirect('back');
            }
            else{
                // does user own the campground
                if(foundCampground.author.id.equals(req.user.id)){
                    next();
                }
                else{
                    req.flash('error',"You do not have permission to do that");
                    res.redirect('back');
                }
            }
        });
    }
    else{
        req.flash('error',"Please Login First");
        res.redirect("back"); // send user back from where he comes at this page
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err)
                res.redirect('back');
            else{
                // does user own the Comment
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                }
                else{
                    res.redirect('back');
                }
            }
        });
    }
    else{
        res.redirect("back"); // send user back from where he comes at this page
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error',"Please Login First");
    res.redirect('/login');
}


module.exports = middlewareObj;