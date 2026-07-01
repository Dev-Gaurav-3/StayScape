require("dotenv").config();

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
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const cookieParser = require("cookie-parser");
const session = require("express-session")
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const { error } = require("console");
const dbURL = process.env.ATLAS_DB_URL;
const Secret = process.env.SECRET;


let port = 3000;

app.listen(port,() =>{
    console.log(`App is listening at ${port}`);
});

app.get("/",(req,res)=>{
    res.redirect("/listings");
});

main() .then(() =>{
    console.log("Connected to DB");
})
.catch((err) =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbURL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method")); 
app.use(express.static(path.join(__dirname, 'public')));
app.engine("ejs",ejsMate);

app.use(cookieParser());
const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
        secret : Secret,
    },
    touchAfter : 24 * 3600,
});

store.on("error",()=>{
    console.log("error in Mongo Session Store",error);
});

const sessionOptions = {
    store,
    secret : Secret,
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

app.use(passport.initialize());
app.use(passport.session()); //? needs to verify user as they browse page by page 
passport.use(new LocalStrategy(User.authenticate()));
passport. serializeUser(User.serializeUser()); // serialize means storing user's info into session
passport.deserializeUser(User.deserializeUser());// 


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async (req,res)=>{
//     let fakeUser = new User({
//         email : "fakeUser@gmail.com",
//         username : "IAmFake",
//     });
//     let registeredUser = await User.register(fakeUser,"iampassword");
//     res.send(registeredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter); // this will not pass the id so to overcome this we use mergeparams in review.js
app.use("/",userRouter);




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
    res.status(status).render("./listings/error.ejs", { msg });
});