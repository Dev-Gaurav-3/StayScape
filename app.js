const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")  // For duplicate layouts //
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schemaValidator.js");
const Review = require("./models/reviews.js");

let port = 3000;

app.listen(port,() =>{
    console.log(`App is listening at ${port}`);
});

app.get("/",(req,res)=>{
    res.send("Working");
});

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

const validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error)
    }else{
        next();
    }
}

main() .then(() =>{
    console.log("Connected to DB");
})
.catch((err) =>{
    console.log(err);
})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method")); 
app.use(express.static(path.join(__dirname, 'public')));
app.engine("ejs",ejsMate);


// This line must come BEFORE your route definitions
// app.get("/testListing",(req,res)=>{
//     let sampleListing = new Listing({
//         title : "My new Villa",
//         description : "By the Beach",
//         price : 1500,
//         location : "Goa",
//         country : "India",
//     });
//     sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

// INDEX ROUTE //
app.get("/listings", async (req, res) => {
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

    res.render("listings/index", { allListings, search: search || "" });
});

// NEW ROUTE //

app.get("/listings/new",(req,res) =>{
    res.render("./listings/new.ejs");
});
// SHOW ROUTE //

app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const aListing = await Listing.findById(id).populate("reviews");
    res.render("./listings/aListing.ejs",{aListing});
});

// CREATE ROUTE //

app.post("/listings",validateListing,wrapAsync(async(req,res,next) =>{
    // let {title,desc,img,price,loc,country} = req.body;
    // OR //
    // if(!req.body.listings){    //? USING SCHEMA VALIDATOR INSTEAD OF THIS => JOI package// 
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    })
);

// EDIT ROUTE //

app.get("/listings/:id/edit",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing}); 
    })
);

app.put("/listings/:id",validateListing,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedData = req.body.listing;
    if (!updatedData.image || !updatedData.image.url || updatedData.image.url.trim() === "") {
        delete updatedData.image;
    }

    await Listing.findByIdAndUpdate(id, updatedData, { runValidators: true, new: true });
    res.redirect(`/listings/${id}`);    
})
);

//DELETE ROUTE //

app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

// REVIEWS POST ROUTE //

app.post("/listings/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("New review Saved");
    res.redirect(`/listings/${id}`);
}));

// DELETE REVIEW //

app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let { id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}}); // pull is used so it will remove review id from reviews
    await Review.findById(reviewId);
    res.redirect(`/listings/${id}`);
}));


// Error Handling //

app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    console.log(err);
    console.log(err.status);

    let { status = 500, msg = "Something went wrong" } = err;
    res.status(status).render("./listings/error.ejs", { msg });
});