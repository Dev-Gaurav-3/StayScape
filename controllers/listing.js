const Listing = require("../models/listing.js");


module.exports.index = async(req,res)=>{
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

    res.render("listings/index.ejs", { allListings, search: search || "" });
};

module.exports.newRenderForm = (req,res) =>{
    res.render("./listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
        const aListing = await Listing.findById(id).populate({path:"reviews",populate:{
          path:"author",
        },
    }).populate("owner");
    // console.log(id);
    // console.log(aListing);
    res.render("./listings/aListing.ejs",{aListing});
};

module.exports.createListing = async(req,res,next) =>{
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
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing}); 
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let updatedData = req.body.listing;

    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit this listing.");
        return res.redirect(`/listings/${id}`);
    }

    // If image blank don't overwrite
    if (!updatedData.image || updatedData.image.trim() === "") {
        delete updatedData.image;
    }

    await Listing.findByIdAndUpdate(id, updatedData, { runValidators: true, new: true });
    req.flash("success", "Listing Edited Successfully!!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!!")
    res.redirect("/listings");
};