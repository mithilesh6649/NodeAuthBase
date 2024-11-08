var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController.js");
var miscController = require("../controllers/miscController.js");
const {
    upload
} = require('../utils/upload.js');
const {
    Auth
} = require('../middleware/index.js');

// var apiValidate = require("./validation/api.validation");


//withoutauth routes

router.post("/api/signup", authController.userRegistration);
router.post("/api/vendor/signup", authController.vendorRegistration);


router.get("/api/category", miscController.getCategories);
router.post("/api/login", authController.userLogin);


//auth routes
router.post("/api/details", Auth, authController.userDetails);


module.exports = router;