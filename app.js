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
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const cookieParser = require("cookie-parser");
const session = require("express-session")
const flash = require("connect-flash");


let port = 3000;

app.listen(port,() =>{
    console.log(`App is listening at ${port}`);
});

app.get("/",(req,res)=>{
    res.send("Working");
});

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

app.use(cookieParser());
const sessionOptions = {
    secret : "mySuperSecret",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //means +7 days 
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews); // this will not pass the id so to overcome this we use mergeparams in review.js





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


// Error Handling //

app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    console.log(err);
    console.log(err.status);
    let { status = 500, msg = "Something went wrong" } = err;
    req.flash("error","Lisitng Does not Exist!");
    res.status(status).render("./listings/error.ejs", { msg });
});