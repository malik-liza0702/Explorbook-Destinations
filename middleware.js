const Listing=require("./models/Listing");
const Review=require("./models/review");
const {reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    // checks the user stored in current session is authenticated or not.
    // isAuthenticated is an inbuilt method of passport to authenticate whether the user is logged in or not
    console.log(req.user);
    console.log(req.path,"..",req.originalUrl);
    
    if(!req.isAuthenticated()){
        // redirect url needs to be saved
        req.session.redirectUrl=req.originalUrl;
        console.log("Redirect url",req.session.redirectUrl);

        req.flash("error","you must be logged in to create or edit a listing");
        return res.redirect("/login");
    }
    next();

}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let id=req.params.id.trim();

    let listing= await Listing.findById(id);

    console.log(listing.owner._id);
    console.log(res.locals.currUser._id);

    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        console.log("in flshhhhhh");
        req.flash("error","you dont have the permission to edit or delete");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;

    let review= await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currUser._id)){
        // console.log("in flashhhhhh");
        req.flash("error","You don't have the permission to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
