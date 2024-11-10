 const db = require("../models/index");
 const config = require("../config/config");
 const User = db.users;
 const UserCategory = db.user_categories;
 const UserSubcategory = db.user_subcategories;
 const UserTiming = db.user_timings;
 const UserDetail = db.user_details;
 const Category = db.categories;
 const bcrypt = require("bcrypt");
 const jwt = require("jsonwebtoken");
 const helper = require('../utils/index');
 const {
     sendVerificationEmail
 } = require('../utils/mailer');
 const fs = require("fs");
 const path = require("path");

 const {
     saveUploadedFile
 } = require('../utils/upload');
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
     /*********************User Signup**************** ****/
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
                 first_name,
                 last_name,
                 email,
                 password,
                 confirm_password,
                 address,
                 address_line2,
                 country,
                 state,
                 city,
                 zip_code,
                 role_id,
                 phone_number
             } = req.fields;

             //  Apply logic

             const existingUser = await User.findOne({
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
             const newUser = await User.create({
                 first_name,
                 last_name,
                 role_id,
                 email,
                 password: hashPassword,
                 confirm_password,
                 address,
                 address_line2,
                 country,
                 state,
                 city,
                 zip_code,
                 phone_number
             });


             //  Send Mail Start

             // Utility function to generate a simple verification token (for example purposes)
             const generateVerificationToken = (email) => {
                 // You could use a JWT or a secure random string for this token
                 return Buffer.from(email).toString('base64'); // Just a simple base64 encoding for illustration
             };



             // Generate a unique verification link (e.g., a token or URL with a token)
             const verificationToken = generateVerificationToken(email); // Implement this function
             const verificationLink = `http://localhost:8000/api/details/verify-email?token=${verificationToken}`;



             // Send the verification email
             await sendVerificationEmail(email, verificationLink);

             // Send Mail End


             let data = helper.success(200, 'Data insert successfully !');
             return res.status(200).json(data);


         } catch (e) {
             console.error('Error during user registration:', e); // Log the actual error to understand the issue

             let data = helper.failed(500, 'Something went to wrong !');
             return res.status(500).json(data);
         }
     }







     /************* Vendor Signup API **************/



     vendorRegistrationOLD = async (req, res) => {
         const transaction = await db.sequelize.transaction();
         try {

             // Extract form data from request
             const {
                 first_name,
                 last_name,
                 email,
                 password,
                 phone_number,
                 confirm_password,
                 address,
                 address_line2,
                 country,
                 state,
                 city,
                 zip_code,
                 role_id,
                 vendor_name,
                 vendor_description,
                 budget,
                 client_size_min,
                 client_size_max,
                 categories,
                 timings
             } = req.fields;



             // Validate passwords match
             if (password !== confirm_password) {
                 let data = helper.failed(400, 'Passwords do not match');
                 return res.status(400).json(data);
             }

             // Hash the password before storing it
             const hashedPassword = await bcrypt.hash(password, 10);

             // Check if the email already exists
             const existingUser = await User.findOne({
                 where: {
                     email
                 }
             });
             if (existingUser) {
                 let data = helper.failed(400, 'Email already in use');
                 return res.status(400).json(data);
             }

             // Create new user in the `users` table
             const newUser = await User.create({
                 first_name,
                 last_name,
                 email,
                 password: hashedPassword,
                 phone_number,
                 address,
                 address_line2,
                 country,
                 state,
                 city,
                 zip_code,
                 role_id
             }, {
                 transaction
             });

             // Directory for image uploads
             const targetDir = 'public/images';

             // Validation options for images
             const options = {
                 maxSize: 5 * 1024 * 1024, // 5MB size limit
                 allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
             };

             // Process image files
             let imageUrl = null;
             if (req.files && req.files.image) {
                 imageUrl = await saveUploadedFile(req.files.image, targetDir, options); // Save profile image
             }

             // Process additional file uploads (food license, ID, etc.)
             const foodLicenseUrl = req.files.food_license_url ? await saveUploadedFile(req.files.food_license_url, targetDir, options) : null;
             const idImageUrl = req.files.id_image_url ? await saveUploadedFile(req.files.id_image_url, targetDir, options) : null;
             const serviceImageUrl = req.files.service_image_url ? await saveUploadedFile(req.files.service_image_url, targetDir, options) : null;
             const vendorLogo = req.files.vendor_logo ? await saveUploadedFile(req.files.vendor_logo, targetDir, options) : null;

             // Create new vendor details in the `user_details` table
             const newUserDetail = await UserDetail.create({
                 user_id: newUser.id,
                 vendor_name,
                 vendor_description,
                 budget,
                 client_size_min,
                 client_size_max,
                 image_url: imageUrl,
                 image_url: imageUrl,
                 food_license_url: foodLicenseUrl,
                 id_image_url: idImageUrl,
                 service_image_url: serviceImageUrl,
                 vendor_logo: vendorLogo
             }, {
                 transaction
             });

             // Create relationships between user and categories
             const categoryIds = category_id.split(',').map(id => parseInt(id));
             for (const categoryId of categoryIds) {
                 await UserCategory.create({
                     user_id: newUser.id,
                     category_id: categoryId
                 }, {
                     transaction
                 });
             }

             // Commit transaction
             await transaction.commit();

             // Return success response
             let data = helper.success(201, 'Vendor registered successfully');
             return res.status(201).json(data);

         } catch (e) {
             await transaction.rollback();
             console.error('Error during vendor signup:', e);

             let data = helper.failed(500, 'Something went wrong');
             return res.status(500).json(data);
         }
     }



     vendorRegistration = async (req, res) => {
         const transaction = await db.sequelize.transaction();
         try {
             // Extract form data from request
             const {
                 first_name,
                 last_name,
                 email,
                 password,
                 phone_number,
                 confirm_password,
                 address,
                 address_line2,
                 country,
                 state,
                 city,
                 zip_code,
                 role_id,
                 vendor_name,
                 vendor_description,
                 budget,
                 client_size_min,
                 client_size_max,
                 categories, // Array of category/subcategory objects
                 timings // Array of timing objects
             } = req.fields;


             // Parse categories if it is a string
             let parsedCategories = [];
             if (categories) {
                 try {
                     parsedCategories = JSON.parse(categories); // Convert string to array
                 } catch (error) {
                     console.error("Error parsing categories:", error);
                     let data = helper.failed(400, 'Invalid categories format');
                     return res.status(400).json(data);
                 }
             }

             // Parse timings if it is a string
             let parsedTimings = [];
             if (timings) {
                 try {
                     parsedTimings = JSON.parse(timings); // Convert string to array
                 } catch (error) {
                     console.error("Error parsing timings:", error);
                     let data = helper.failed(400, 'Invalid timings format');
                     return res.status(400).json(data);
                 }
             }

             console.log("Parsed Categories: ", parsedCategories);
             console.log("Parsed Timings: ", parsedTimings);
             console.log("Are categories an array? ", Array.isArray(parsedCategories)); // Should return true
             console.log("Are timings an array? ", Array.isArray(parsedTimings)); // Should return true


             // Validate required fields
             if (!first_name || !last_name || !email || !password || !confirm_password || !phone_number || !address || !country || !state || !city || !zip_code || !role_id || !vendor_name || !vendor_description || !budget || !client_size_min || !client_size_max || !categories) {
                 let data = helper.failed(400, 'Missing required fields');
                 return res.status(400).json(data);
             }

             // Validate passwords match
             if (password !== confirm_password) {
                 let data = helper.failed(400, 'Passwords do not match');
                 return res.status(400).json(data);
             }

             // Hash the password before storing it
             const hashedPassword = await bcrypt.hash(password, 10);

             // Check if the email already exists
             const existingUser = await User.findOne({
                 where: {
                     email
                 }
             });
             if (existingUser) {
                 let data = helper.failed(400, 'Email already in use');
                 return res.status(400).json(data);
             }

             // Create new user in the `users` table
             const newUser = await User.create({
                 first_name,
                 last_name,
                 email,
                 password: hashedPassword,
                 phone_number,
                 address,
                 address_line2,
                 country,
                 state,
                 city,
                 zip_code,
                 role_id
             }, {
                 transaction
             });

             // Directory for image uploads
             const targetDir = 'public/images';
             const options = {
                 maxSize: 5 * 1024 * 1024, // 5MB size limit
                 allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
             };


             //  console.log(req.files);
             //  return false;

             // Process image files
             let imageUrl = null;
             if (req.files && req.files.image) {
                 imageUrl = await saveUploadedFile(req.files.image, targetDir, options); // Save profile image
             }

             // Process additional file uploads (food license, ID, etc.)
             const foodLicenseUrl = req.files.food_license_url ? await saveUploadedFile(req.files.food_license_url, targetDir, options) : null;
             const idImageUrl = req.files.id_image_url ? await saveUploadedFile(req.files.id_image_url, targetDir, options) : null;
             const serviceImageUrl = req.files.service_image_url ? await saveUploadedFile(req.files.service_image_url, targetDir, options) : null;
             const vendorLogo = req.files.vendor_logo ? await saveUploadedFile(req.files.vendor_logo, targetDir, options) : null;

             // Create new vendor details in the `user_details` table
             const newUserDetail = await UserDetail.create({
                 user_id: newUser.id,
                 vendor_name,
                 vendor_description,
                 budget,
                 client_size_min,
                 client_size_max,
                 image_url: imageUrl,
                 food_license_url: foodLicenseUrl,
                 id_image_url: idImageUrl,
                 service_image_url: serviceImageUrl,
                 vendor_logo: vendorLogo
             }, {
                 transaction
             });

             // Create relationships between user and categories
             if (Array.isArray(parsedCategories) && parsedCategories.length > 0) {
                 for (const category of parsedCategories) {



                     const {
                         category_id,
                         subcategories
                     } = category;

                     // Create UserCategory for each category
                     await UserCategory.create({
                         user_id: newUser.id,
                         category_id: category_id
                     }, {
                         transaction
                     });

                     // Now associate subcategories
                     if (Array.isArray(subcategories) && subcategories.length > 0) {
                         for (const subcategory_id of subcategories) {
                             await UserSubcategory.create({
                                 user_id: newUser.id,
                                 category_id: category_id,
                                 subcategory_id: subcategory_id
                             }, {
                                 transaction
                             });
                         }
                     }
                 }
             }

             // Create user timings (if any)
             if (Array.isArray(parsedTimings) && parsedTimings.length > 0) {
                 for (const timing of parsedTimings) {
                     const {
                         day_id,
                         day_name,
                         start_time,
                         end_time,
                         status
                     } = timing;
                     await UserTiming.create({
                         user_id: newUser.id,
                         day_id,
                         day_name,
                         start_time,
                         end_time,
                         status: status || 1 // Default to 1 (active)
                     }, {
                         transaction
                     });
                 }
             }

             // Commit transaction
             await transaction.commit();

             // Return success response
             let data = helper.success(201, 'Vendor registered successfully');
             return res.status(201).json(data);

         } catch (e) {
             await transaction.rollback();
             console.error('Error during vendor signup:', e);

             let data = helper.failed(500, 'Something went wrong');
             return res.status(500).json(data);
         }
     };





     //  /*********************Login**************** ****/
     //  userLogin = async (req, res) => {
     //      try {
     //          let params = req.fields;

     //          const {
     //              error,
     //              value
     //          } = userValidator.login.validate(params);

     //          if (error) {
     //              let data = helper.failed(400, error.details[0].message);
     //              return res.status(400).json(data);
     //          }


     //          // Destructure only if validation passes
     //          const {
     //              email,
     //              password
     //          } = req.fields;

     //          //  Apply logic

     //          const userData = await User.findOne({
     //              where: {
     //                  email
     //              }
     //          });



     //          if (!userData) {
     //              let data = helper.failed(400, 'Email and Password is Incorrect !');
     //              return res.status(400).json(data);
     //          }

     //          // hashpassword

     //          const passwordMatch = await bcrypt.compare(password, userData.password);

     //          if (!passwordMatch) {
     //              let data = helper.failed(400, 'Email and Password is Incorrect !');
     //              return res.status(400).json(data);
     //          }


     //          //  if (userData.is_verified == 0) {
     //          //      let data = helper.failed(401, 'Please Verify Your Account !');
     //          //      return res.status(401).json(data);
     //          //  }

     //          // Create new user


     //          const accessToken = await generateAccessToken({
     //              user: userData
     //          })

     //          const response = {
     //              user: userData,
     //              accessToken: accessToken,
     //              tokenType: "Bearer",
     //          };

     //          let data = helper.success(200, 'Login successfully!', response);
     //          return res.status(200).json(data);



     //      } catch (e) {
     //          console.error('Error during user login:', e); // Log the actual error to understand the issue

     //          let data = helper.failed(500, 'Something went to wrong !');
     //          return res.status(500).json(data);
     //      }
     //  }



     /*********************Login********************/

     /*********************Login********************/

     userLogin = async (req, res) => {
         try {
             let params = req.fields;

             // Validate user input
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

             // Fetch user data with associated user details and categories
             const userData = await User.findOne({
                 where: {
                     email
                 },
                 include: [{
                         model: UserDetail,
                         as: 'userDetail', // Alias for user_detail association
                         required: false // Ensure the user has user_details
                     },
                     {
                         model: db.user_categories, // Categories associated with user
                         as: 'userCategories', // Alias for categories model (you should use this alias based on the association)
                         required: false, // Categories are optional, so this can be false
                         include: [{
                             model: db.categories, // Include the associated category
                             as: 'categories', // Alias for category association in user_categories
                             attributes: ['id', 'name'] // Only include id and name from categories
                         }]

                     },
                     {
                         model: db.user_subcategories, // Categories associated with user
                         as: 'userSubCategories', // Alias for categories model (you should use this alias based on the association)
                         required: false, // Categories are optional, so this can be false

                     }
                 ]
             });

             if (!userData) {
                 let data = helper.failed(400, 'Email and Password is Incorrect!');
                 return res.status(400).json(data);
             }

             // Check if password matches
             const passwordMatch = await bcrypt.compare(password, userData.password);

             if (!passwordMatch) {
                 let data = helper.failed(400, 'Email and Password is Incorrect!');
                 return res.status(400).json(data);
             }

             // Create access token
             const accessToken = await generateAccessToken({
                 user: userData
             });

             // Prepare the response
             const response = {
                 user: userData, // Basic user info
                 accessToken: accessToken, // JWT token
                 tokenType: "Bearer", // Token type
             };

             let data = helper.success(200, 'Login successfully!', response);
             return res.status(200).json(data);

         } catch (e) {
             console.error('Error during user login:', e); // Log the actual error for debugging

             let data = helper.failed(500, 'Something went wrong!');
             return res.status(500).json(data);
         }
     };






     /*********************Details**************** ****/
     userDetails = async (req, res) => {
         try {
             const userData = await User.findOne({
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


     /*********************getVendorList**************** ****/
     getVendorList = async (req, res) => {
         try {




         } catch (e) {
             console.error('Error during :', e); // Log the actual error to understand the issue

             let data = helper.failed(500, 'Something went to wrong !');
             return res.status(500).json(data);
         }
     }




 }

 module.exports = new AuthController();