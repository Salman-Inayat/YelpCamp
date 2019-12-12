var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");



// INDEX  ROUTE- show all campgrounds
router.get("/",(req, res)=>{
// 	get all campgrounds from database
	Campground.find({},function(err, allCampgrounds){
		if (err){
			console.log(err);
		}else{
				res.render("campground/index",{campgrounds:allCampgrounds, currentUser: req.user});
		}
	});
});

// CREATE ROUTE, add new campground to database
router.post("/", middleware.isLoggedIn,(req, res)=>{
    // get data from form and add to campgrounds array	
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author= {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price :price, image: image, description: desc, author: author};
	// 	Create a new campground and save it to database
	Campground.create(newCampground,function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirects back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

// NEW, show form to create new campground
router.get("/new", middleware.isLoggedIn,(req, res)=>{
	res.render("campground/new.ejs");
});


// SHOW - shows more info about one campground
router.get("/:id",(req, res)=>{
	// 	Find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampgrounds){
		if(err){
			console.log(err);
		}else{
			//render show template with that campground
			res.render("campground/show",{campground: foundCampgrounds});
		}
	});
});

// Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findById(req.params.id, function(err, foundCampground){
	res.render("campground/edit",{campground  : foundCampground});
	});	
});

// Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			//redirect somewhere(show page)
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Delete campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});		  
});


module.exports = router;
