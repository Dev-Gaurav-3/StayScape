const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signup, login, renderSignup, renderLogin, logout } = require("../controllers/user.js");

router.get("/signup",renderSignup);

router.post("/signup",wrapasync(signup));

router.get("/login",renderLogin);

// authentication will be done by passport so we have to use middleware //
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}),login);

router.get("/logout",logout);

module.exports = router;