const Review = require("./models/reviews.js");

module.exports.isLoggedIn = (action) => {
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            // Save the LISTING page URL, not the delete/action URL
            // For review routes, redirect back to the listing page
            req.session.redirectUrl = req.headers.referer || "/listings";
            req.flash("error", `You must be logged in first to ${action} a listing!`);
            return res.redirect("/login");
        }
        next();
    };
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; // we are saving this in locals beacuse passport auto delete the session info 
    }
    next();
};

module.exports.isAuthor = async(req,res,next) =>{
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`); 
    }
    next();
};