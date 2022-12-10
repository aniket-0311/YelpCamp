const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds.js")
const CatchAsync = require("../utils/CatchAsync")
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware.js");

const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({storage});

router.route("/")
    .get(CatchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, CatchAsync(campgrounds.createCamp))
    

router.get("/new",isLoggedIn, campgrounds.renderNewForm);


router.route("/:id")
    .get(CatchAsync(campgrounds.showCamp))
    .put(isLoggedIn, isAuthor ,upload.array("image"), validateCampground, CatchAsync(campgrounds.updateCamp))
    .delete(isLoggedIn, isAuthor, CatchAsync(campgrounds.deleteCamp))

router.get("/:id/edit",isLoggedIn, isAuthor, CatchAsync(campgrounds.editCamp));


module.exports = router;