var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User     = require("../models/user");


// YELPCAMP ROUTES
// LANDING ROUTE
router.get("/",(req, res)=>{
	res.render("campground/landing");
});


// REGISTER ROUTES
router.get("/register", (req, res)=>{
	res.render("register");
});

// handle sign up logic
router.post("/register", (req, res)=>{
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}else{
			passport.authenticate("local")(req, res, function(){
				req.flash("success","Hi " + user.username + ", Welcome to YelpCamp");
				res.redirect("/campgrounds");
			});
		}
	});
});

// LOGIN ROUTES
router.get("/login", (req, res)=>{
	res.render("login");
});

// handle login logic
//   app.post("/login), middleware, callback
router.post("/login", passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), (req, res)=>{
});

// LOGOUT ROUTE
router.get("/logout", ( req, res)=>{
	req.logout();
	req.flash("success","Logged you out");
	res.redirect("/campgrounds");
});


module.exports = router;

