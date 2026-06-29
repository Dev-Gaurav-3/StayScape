const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("../schemaValidator.js");
const { isLoggedIn } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const { deserializeUser } = require("passport");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const validateListing = (req,res,next)=>{
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    let { error } = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

router.route("/")   // When path is same we use router.route
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,wrapAsync(listingController.createListing))

// NEW ROUTE //
router.get("/new",isLoggedIn("create"),listingController.newRenderForm);

router.route("/:id")
.get(listingController.showListing)
.put(isLoggedIn("edit"), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn("delete"),listingController.destroyListing);

// INDEX ROUTE //
// router.get("/",wrapAsync(listingController.index));



// SHOW ROUTE //
// router.get("/:id",listingController.showListing);

// CREATE ROUTE //

// router.post("/",validateListing,wrapAsync(listingController.createListing)
// );

// EDIT ROUTE //

router.get("/:id/edit",isLoggedIn("edit"),wrapAsync(listingController.renderEditForm)
);

// router.put("/:id", isLoggedIn("edit"), validateListing, wrapAsync(listingController.updateListing));

// DELETE ROUTE ///

// router.delete("/:id",isLoggedIn("delete"),listingController.destroyListing);

module.exports = router;