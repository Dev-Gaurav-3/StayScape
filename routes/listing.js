const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("../schemaValidator.js");
const { isLoggedIn } = require("../middleware.js");

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

// INDEX ROUTE //
router.get("/", async (req, res) => {
    let { search } = req.query;
    let allListings;

    if (search && search.trim() !== "") {
        allListings = await Listing.find({
            $or: [
                { title:    { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country:  { $regex: search, $options: "i" } },
            ]
        });
    } else {
        allListings = await Listing.find({});
    }

    res.render("./listings/index", { allListings, search: search || "" });
});

// NEW ROUTE //

router.get("/new",isLoggedIn("create"),(req,res) =>{
    res.render("./listings/new.ejs");
});
// SHOW ROUTE //

router.get("/:id",async(req,res)=>{
    let {id} = req.params;
    const aListing = await Listing.findById(id).populate("reviews").populate("owner");
    // console.log(id);
    // console.log(aListing);
    res.render("./listings/aListing.ejs",{aListing});
});


// CREATE ROUTE //

router.post("/",validateListing,wrapAsync(async(req,res,next) =>{
    // let {title,desc,img,price,loc,country} = req.body;
    // OR //
    // if(!req.body.listings){    //? USING SCHEMA VALIDATOR INSTEAD OF THIS => JOI package// 
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!!");
    res.redirect("/listings");
    })
);

// EDIT ROUTE //

router.get("/:id/edit",isLoggedIn("edit"),validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing}); 
})
);

router.put("/:id",validateListing,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedData = req.body.listing;
    if (!updatedData.image || !updatedData.image.url || updatedData.image.url.trim() === "") {
        delete updatedData.image;
    }
    
    await Listing.findByIdAndUpdate(id, updatedData, { runValidators: true, new: true });
    req.flash("success","Listing Edited Successfully!!")
    res.redirect(`/listings/${id}`);    
})
);

//DELETE ROUTE //

router.delete("/:id",isLoggedIn("delete"),async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!!")
    res.redirect("/listings");
});

module.exports = router;