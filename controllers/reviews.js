const cg = require("../models/campground.js");
const rs = require("../models/review.js");


module.exports.createReview = async (req, res, next) => {
    const campground = await cg.findById(req.params.id);
    const review = new rs(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully created a New review");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async(req, res, next) =>{
    const { id, reviewId } = req.params;
    await cg.findByIdAndUpdate(id, { $pull: { reviews: reviewId}});
    await rs.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted a Review");
    res.redirect(`/campgrounds/${id}`);
}