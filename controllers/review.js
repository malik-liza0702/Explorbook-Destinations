const Listing=require("../models/Listing");
const Review=require("../models/review")

module.exports.createReview=async(req,res)=>{
    console.log("params id",req.params.id);
    let listing=await Listing.findById(req.params.id.trim());
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("success","New Review created!")
    res.redirect(`/listings/${listing._id}`)
}

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!")
    res.redirect(`/listings/${id}`);
}