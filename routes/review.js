const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("../schemaValidator.js");
const { isLoggedIn ,isAuthor, isLoggedInForAction} = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/review.js");

const validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error)
    }else{
        next();
    }
}

// REVIEWS POST ROUTE //

router.post("/",isLoggedInForAction("add a review in "),validateReview,wrapAsync(createReview));

// DELETE REVIEW //

router.delete("/:reviewId",isLoggedInForAction("delete a review from "),isAuthor,wrapAsync(destroyReview));

module.exports = router;