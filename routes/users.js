const express = require("express");
const router = express.Router();
const CatchAsync = require("../utils/CatchAsync");
const users = require("../controllers/users.js");
const passport = require("passport");


router.route("/register")
    .get( users.renderRegister)
    .post(CatchAsync(users.newUser))

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate("local", {failureFlash: true , failureRedirect: "/login"}), users.loginUser)

router.get("/logout", users.logoutUser);

module.exports = router;