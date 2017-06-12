var express = require("express");
var router = express.Router({mergeParams: true});
var Instablog = require("../models/instablog")
var middleware = require("../middleware")
//INDEX - show all instablogs
router.get("/",middleware.isLoggedIn, function(req, res){
    // Get all instablogs from DB
    Instablog.find({}, function(err, allInstablogs){
       if(err){
           console.log(err);
       } else {
          res.render("instablogs/index",{instablogs:allInstablogs});
       }
    });
});

//CREATE - add new instablog to DB
router.post("/",middleware.isLoggedIn, function(req, res){
    // get data from form and add to instablogs array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newInstablog = {name: name, image: image, description: desc, author: author}
    // Create a new instablog and save to DB
    Instablog.create(newInstablog, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // console.log(newlyCreated)
            //redirect back to instablogs page
            res.redirect("/instablogs");
        }
    });
});

//NEW - show form to create new instablog
router.get("/new",middleware.isLoggedIn, function(req, res){
   res.render("instablogs/new");
});

// SHOW - shows more info about one instablog
router.get("/:id", function(req, res){
    //find the instablog with provided ID
    Instablog.findById(req.params.id).populate("comments").exec(function(err, foundInstablog){
        if(err){
            console.log(err);
        } else {
            //render show template with that instablog
            res.render("instablogs/show", {instablog: foundInstablog});
        }
    });
})
//edit
router.get("/:id/edit",middleware.checkInstablogOwnership, function(req, res) {
    Instablog.findById(req.params.id,function(err, foundInstablog ){
              res.render("instablogs/edit", {instablog: foundInstablog});
            });
});
//update
router.put("/:id",middleware.checkInstablogOwnership, function(req,res){
    Instablog.findByIdAndUpdate(req.params.id, req.body.instablog, function(err, updatedInstablog){
        if(err){
            res.redirect("/instablogs")
        }else{
            res.redirect("/instablogs/" + req.params.id);
        }
        
    })
})
//delete
router.delete("/:id",middleware.checkInstablogOwnership, function(req, res) {
    Instablog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/login")
        }else{
            res.redirect("/instablogs")
        }
    })
})

module.exports = router;