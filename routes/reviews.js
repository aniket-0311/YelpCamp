const express = require("express");
const router = express.Router({mergeParams: true});
const reviews = require("../controllers/reviews.js");
const CatchAsync = require("../utils/CatchAsync")
const ExpressError = require("../utils/ExpressError");
const { validateReview, isLoggedIn } = require("../middleware.js");



router.post("/",isLoggedIn,validateReview, CatchAsync(reviews.createReview));

router.delete("/:reviewId",isLoggedIn ,CatchAsync(reviews.deleteReview));

module.exports = router;