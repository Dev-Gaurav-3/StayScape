const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
});

router.post("/signup",wrapasync(async(req,res)=>{
    try{
        let { username,email,password } = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err) return next(err);
            else{
                req.flash("success",`Hello ${username},StayScape welcomes you!!`);
                res.redirect("/listings");
            }
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
});

// authentication will be done by passport so we have to use middleware //
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect : "/login",failureFlash : true}),async(req,res)=>{
    let { username } = req.body
    req.flash("success",`Welcome Back, ${username}`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully"); 
        res.redirect("/listings");
    });
});

module.exports = router;