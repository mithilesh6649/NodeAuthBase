var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController.js");
var vendorController = require("../controllers/vendorController.js");
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
router.get("/api/get/vendor/list", authController.getVendorList);

router.post("/api/forgot/password", authController.forgotPassword)
router.get("/verify-email", authController.verifyEmail);
router.get("/reset-password", authController.showResetPasswordPage);
router.post("/reset-password", authController.resetPassword);

//Vendor section
router.post("/api/forgot/password", authController.forgotPassword)



//auth routes
router.post("/api/add/menu", Auth, vendorController.addMenus);
router.post("/api/add/menu/item", Auth, vendorController.addMenuItem);

router.get("/api/get/menu/list", Auth, vendorController.getMenuList);


module.exports = router;