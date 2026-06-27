module.exports.isLoggedIn = (action) => {
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.session.redirectUrl = req.originalUrl; // to redirect use on new listing page or on the same page user wants to edit or delete
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
}