var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy =require("passport-local"),
    methodOverride = require("method-override"),
    Instablog  = require("./models/instablog"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
   //requiring routes 
var commentRoutes   = require("./routes/comments"),
    instablogRoutes= require("./routes/instablog"),
    indexRoutes      = require("./routes/index")

// mongoose.connect(process.env.DATABASEURL)
var url = process.env.DATABASEURL || "mongodb://localhost/InstaDairy_Codechallenge"
mongoose.connect(url);


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Insta Dairy secret page session",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success       = req.flash("success");
    next();
});
app.use("/",indexRoutes);
app.use("/instablogs",instablogRoutes);
app.use("/instablogs/:id/comments",commentRoutes);
    



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The InstaDairy Server Has Started!");
});