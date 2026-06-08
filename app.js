const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")  // For duplicate layouts //


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
    const aListing = await Listing.findById(id);
    res.render("./listings/aListing.ejs",{aListing});
});

// CREATE ROUTE //

app.post("/listings",async (req,res) =>{
    // let {title,desc,img,price,loc,country} = req.body;
    // OR //
    const newListing = new Listing(req.body.listings);
    await newListing.save();
    res.redirect("/listings");
});

app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing}); 
});

app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    console.log(req.body);
    const updated = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    console.log("Updated:", updated);
    res.redirect("/listings");
});

//DELETE ROUTE //

app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});