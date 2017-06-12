var middlewareObj = {};
var Instablog = require("../models/instablog");
var Comment = require("../models/comment");

middlewareObj.checkInstablogOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Instablog.findById(req.params.id,function(err, foundInstablog ){
        if(err){
            req.flash("error", "instablog not found")
            res.redirect("back");
        }else{
            //does user own the instablog
            if(foundInstablog.author.id.equals(req.user._id)){
              next();  
            }else{
                req.flash("error", "You Don't Have Permission To Do That !!")
               res.redirect("back") 
            }
        }
    }); 
    }else{
        res.redirect("back")
    }
}
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err, foundComment ){
        if(err){
            req.flash("error", "instablog not found")
            res.redirect("back");
        }else{
            //does user own the instablog
            if(foundComment.author.id.equals(req.user._id)){
              next();  
            }else{
            req.flash("error", "You Don't Have Permission To Do That !!")
               res.redirect("back") 
            }
        }
    }); 
    }else{
        req.flash("error", "You Need To Be Login To Do That !!")
        res.redirect("back")
    }
}
middlewareObj.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error", "You Need To Be Logged In To Do That !!");
    res.redirect("/login");
}

module.exports = middlewareObj;