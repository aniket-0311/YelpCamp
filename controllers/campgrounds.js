const cg = require("../models/campground.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken : mapboxToken});
const { cloudinary } = require("../cloudinary");

module.exports.index = async(req,res) =>{
    const campgrounds = await cg.find({});
    res.render("campgrounds/index",{campgrounds})  
}

module.exports.renderNewForm = (req, res) =>{
    res.render("campgrounds/new");
}

module.exports.createCamp = async (req,res, next) =>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new cg(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash("success", "Successfully created a Campground");
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCamp = async (req,res,next) =>{
    const campground = await cg.findById(req.params.id).populate({
        path:"reviews",
        populate: {
            path:"author"
        }
    }).populate("author");
    console.log(campground);
    if(!campground){
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", {campground})
}

module.exports.editCamp = async (req,res,next) =>{
    const { id } = req.params;
    const campground = await cg.findById(id);
    if(!campground){
        req.flash("error", "Cannot find that campground to edit!");
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", {campground})
}

module.exports.updateCamp = async (req,res,next) =>{
    const { id } = req.params;
    console.log(req.body);
    const campground = await cg.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages }}}})
    }
    req.flash("success", "Successfully Updated a Campground");
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCamp = async (req,res,next) =>{
    const{ id } = req.params;
    await cg.findByIdAndDelete(id);
    req.flash("success", "Successfully deletd a Campground");
    res.redirect("/campgrounds");
}