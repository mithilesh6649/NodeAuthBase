var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController.js");

const {
    Auth
} = require('../middleware/index.js');

// var apiValidate = require("./validation/api.validation");


//withoutauth routes

router.post("/api/signup", authController.userRegistration);
router.post("/api/login", authController.userLogin);


//auth routes
router.post("/api/details", Auth, authController.userDetails);


module.exports = router;