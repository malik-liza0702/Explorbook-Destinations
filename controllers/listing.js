const Listing=require("../models/Listing");
const {listingSchema}=require("../schema.js");

module.exports.index=(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});   
})

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showListing=async(req,res)=>{
    const id =req.params.id.trim();
    console.log(id);
    const listing=await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        }
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing})
}

module.exports.createListing=async(req,res,next)=>{
    
    let result=listingSchema.validate(req.body);
    console.log("res",result);
    if(result.error){
        console.log("in result")
        throw new ExpressError(400,result.error);
    }
    const newListing=new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New listing created!")
    res.redirect("/listings");
    
    
}

module.exports.renderEditForm=async(req,res)=>{
    let id=req.params.id.trim();
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    
    res.render("listings/edit.ejs",{listing})
    
}

module.exports.updateListing=async(req,res)=>{
    let id=req.params.id.trim();
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);

}

module.exports.destroyListing=async(req,res)=>{
    let id=req.params.id.trim();
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log("delted listing",deleteListing);
    req.flash("success","Listing deleted!")
    res.redirect("/listings")
}