 const db = require("../models/index");
 const config = require("../config/config");
 const users = db.users;
 const bcrypt = require("bcrypt");
 const jwt = require("jsonwebtoken");
 const helper = require('../utils/index');

 //  load Validation
 const {
     userValidator
 } = require('../validators');


 const generateAccessToken = async (user) => {
     const token = jwt.sign(user, config.JWT_SECRET_KEY, {
         expiresIn: "24h"
     });
     return token;
 }


 class AuthController {
     /*********************Signup**************** ****/
     userRegistration = async (req, res) => {
         try {
             let params = req.fields;

             const {
                 error,
                 value
             } = userValidator.signup.validate(params);

             if (error) {
                 let data = helper.failed(400, error.details[0].message);
                 return res.status(400).json(data);
             }


             // Destructure only if validation passes
             const {
                 name,
                 email,
                 password
             } = req.fields;

             //  Apply logic

             const existingUser = await users.findOne({
                 where: {
                     email
                 }
             });



             if (existingUser) {
                 let data = helper.failed(400, 'Email already in use');
                 return res.status(400).json(data);
             }


             // hashpassword

             const hashPassword = await bcrypt.hash(password, 10);

             // Create new user
             const newUser = await users.create({
                 name,
                 email,
                 password: hashPassword,
             });


             let data = helper.success(200, 'Data insert successfully !');
             return res.status(200).json(data);


         } catch (e) {
             console.error('Error during user registration:', e); // Log the actual error to understand the issue

             let data = helper.failed(500, 'Something went to wrong !');
             return res.status(500).json(data);
         }
     }







     /*********************Login**************** ****/
     userLogin = async (req, res) => {
         try {
             let params = req.fields;

             const {
                 error,
                 value
             } = userValidator.login.validate(params);

             if (error) {
                 let data = helper.failed(400, error.details[0].message);
                 return res.status(400).json(data);
             }


             // Destructure only if validation passes
             const {
                 email,
                 password
             } = req.fields;

             //  Apply logic

             const userData = await users.findOne({
                 where: {
                     email
                 }
             });



             if (!userData) {
                 let data = helper.failed(400, 'Email and Password is Incorrect !');
                 return res.status(400).json(data);
             }

             // hashpassword

             const passwordMatch = await bcrypt.compare(password, userData.password);

             if (!passwordMatch) {
                 let data = helper.failed(400, 'Email and Password is Incorrect !');
                 return res.status(400).json(data);
             }


             //  if (userData.is_verified == 0) {
             //      let data = helper.failed(401, 'Please Verify Your Account !');
             //      return res.status(401).json(data);
             //  }

             // Create new user


             const accessToken = await generateAccessToken({
                 user: userData
             })

             const response = {
                 user: userData,
                 accessToken: accessToken,
                 tokenType: "Bearer",
             };

             let data = helper.success(200, 'Login successfully!', response);
             return res.status(200).json(data);



         } catch (e) {
             console.error('Error during user login:', e); // Log the actual error to understand the issue

             let data = helper.failed(500, 'Something went to wrong !');
             return res.status(500).json(data);
         }
     }






     /*********************Details**************** ****/
     userDetails = async (req, res) => {
         try {
             const userData = await users.findOne({
                 where: {
                     id: req.user.user.id
                 }
             });
             let data = helper.success(200, 'Details get successfully!', userData);
             return res.status(200).json(data);

         } catch (e) {
             console.error('Error during :', e); // Log the actual error to understand the issue

             let data = helper.failed(500, 'Something went to wrong !');
             return res.status(500).json(data);
         }
     }




 }

 module.exports = new AuthController();