const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/Listing.js");
const {isLoggedIn,isReviewAuthor,validateReview}=require("../middleware.js");
const reviewController=require("../controllers/review.js")


// Reviews
// Post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


// delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.deleteReview))
module.exports=router;
