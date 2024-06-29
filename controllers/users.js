const User=require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    // req.login() is an inbuilt method of passport to automatically login to account after signup.
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    })}
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");

}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to explorbook! You are logged in!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    console.log( "redirect url in login",redirectUrl)
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    // req.logout takes a call back
    req.logout((err)=>{
        if(err){
           return  next(err);
        }
        req.flash("success","you are logged out now!");
        res.redirect("/listings");

    });

}
