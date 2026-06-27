const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("../schemaValidator.js");
const { isLoggedIn } = require("../middleware.js");

const validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error)
    }else{
        next();
    }
}

// REVIEWS POST ROUTE //

router.post("/",isLoggedIn("add a review in "),validateReview,wrapAsync(async (req,res)=>{
    let { id } = req.params;

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("New review Saved");
    req.flash("success","Review Added Successfully !!");
    res.redirect(`/listings/${id}`);
}));

// DELETE REVIEW //

router.delete("/:reviewId",isLoggedIn("delete a review from "),wrapAsync(async (req,res)=>{
    let { id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}}); // pull is used so it will remove review id from reviews
    await Review.findById(reviewId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;