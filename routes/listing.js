const express=require("express");
const router=express.Router();
const Listing=require("../models/Listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema}=require("../schema.js");

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log("Error",error);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);

    }
    else{
        next();
    }
}

// Index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});   
}))

// new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})

// show route
router.get("/:id",wrapAsync(async(req,res)=>{
    const id =req.params.id.trim();
    console.log(id);
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing})
}))
// create route
router.post("/",wrapAsync(async(req,res,next)=>{
    
    // let result=listingSchema.validate(req.body);
    // console.log("res",result);
    // if(result.error){
    //     console.log("in result")
    //     throw new ExpressError(400,result.error);
    // }
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    
    
}))
// edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let id=req.params.id.trim();
    const listing=await Listing.findById(id);
    console.log(listing)
    res.render("listings/edit.ejs",{listing})
    
}));

// update route
router.put("/:id",
    validateListing,wrapAsync(async(req,res)=>{
    let id=req.params.id.trim();
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);

}));


// delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let id=req.params.id.trim();
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log("delted listing",deleteListing);
    res.redirect("/listings")
}));
module.exports=router;