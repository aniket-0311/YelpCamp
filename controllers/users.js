const User = require("../models/user");
const cg = require("../models/campground.js");



module.exports.renderRegister = (req,res) =>{
    res.render("users/register")
}

module.exports.newUser = async(req,res,next) =>{
    try{
        const { email, username, password } = req.body;
        const usernew = new User({email, username});
        const registeredUser = await User.register(usernew, password);
        req.login(registeredUser, err =>{
            if(err) return next(err);
            req.flash("success", "Welcome to YelpCamp!");
            res.redirect("/campgrounds");
        })
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/register");
    }   
}

module.exports.renderLogin = (req,res) =>{
    res.render("users/login")
}

module.exports.loginUser = (req,res) =>{
    req.flash("success", "Welcome Back!");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo; 
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res) =>{
    req.logOut();
    req.flash("success", "Logged Out!");
    res.redirect("/campgrounds");
}