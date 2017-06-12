var express = require("express");
var router = express.Router({mergeParams: true});
var Instablog = require("../models/instablog")
var Comment = require("../models/comment")
var middleware = require("../middleware")
//comments new
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find instablog by id
    Instablog.findById(req.params.id, function(err, instablog){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {instablog: instablog});
        }
    })
});

//comment create
router.post("/",middleware.isLoggedIn, function(req, res){
   //lookup instablog using ID
   Instablog.findById(req.params.id, function(err, instablog){
       if(err){
           console.log(err);
           res.redirect("/instablogs");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error","something went wrong");
               console.log(err);
           } else {
               comment.author.id = req.user._id;
               comment.author.username= req.user.username;
               comment.save();
               instablog.comments.push(comment);
               instablog.save();
               
               res.redirect('/instablogs/' + instablog._id);
           }
        });
       }
   });
});
//edit comment
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back")
        }else{
           res.render("comments/edit",{instablog_id: req.params.id, comment: foundComment});
        }
    })
    
});
//update comment
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/instablogs/" + req.params.id);
        }
        
    })
})
//DELETE COMMENT
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back")
        }else{
            req.flash("success", "comment deleted")
            res.redirect("/instablogs/" + req.params.id);
        }
    })
})
//middleware 


module.exports = router;