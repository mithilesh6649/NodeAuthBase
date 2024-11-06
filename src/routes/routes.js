var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController.js");
// var apiValidate = require("./validation/api.validation");
 

//auth routes

// router.get("/api/car_list", apiController.car_list);
// router.post(
//   "/api/get_chat_detail",
//   apiValidate.validation,
//   apiController.get_chat_detail
// );
// router.post(
//   "/api/update_lat_lon",
//   apiValidate.validation,
//   apiController.update_lat_lon
// );
 
router.post("/api/signup", authController.userRegistration);

module.exports = router;
