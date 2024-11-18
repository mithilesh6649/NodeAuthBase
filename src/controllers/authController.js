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
     sendVerificationEmail,
     sendPasswordResetEmail
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
             //    const verificationToken = generateVerificationToken(email); // Implement this function
             //    const verificationLink = `${config.SITE_URL}/verify-email?token=${verificationToken}`;
             //  console.log(verificationLink);
             //  return false;


             // Send the verification email
             //   await sendVerificationEmail(email, verificationLink);

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

     /*********************verifyEmail**************** ****/
     verifyEmail = async (req, res) => {
         try {
             // Extract token from query params
             const {
                 token
             } = req.query;


             if (!token) {
                 return res.render('verify-email', {
                     message: 'Token is missing or invalid',
                     messageType: 'error'
                 });
             }

             // Decode the token (assuming it's base64 encoded email for simplicity)
             const decodedEmail = Buffer.from(token, 'base64').toString('utf-8');
             // Find user by decoded email
             const user = await User.findOne({
                 where: {
                     email: decodedEmail
                 }
             });
             if (!user) {
                 return res.render('verify-email', {
                     message: 'User not found',
                     messageType: 'error'
                 });
             }


             user.is_email_verified = true;
             user.email_verified_at = new Date();
             await user.save();

             // Return success message to the view
             return res.render('verify-email', {
                 message: 'Your email has been successfully verified!',
                 messageType: 'success'
             });
         } catch (error) {
             console.error('Error during email verification:', error);
             return res.render('verify-email', {
                 message: 'Something went wrong, please try again later.',
                 messageType: 'error'
             });
         }
     };


     /*********************forgotPassword********************/

     forgotPassword = async (req, res) => {

         try {
             const {
                 email
             } = req.fields;


             // Check if the email exists in the database
             const user = await User.findOne({
                 where: {
                     email
                 }
             });
             if (!user) {
                 let data = helper.failed(400, 'No user found with this email address.');
                 return res.status(400).json(data);
             }

             // Generate a JWT reset token that expires in 1 hour
             const resetToken = jwt.sign({
                 userId: user.id
             }, config.JWT_SECRET_KEY, {
                 expiresIn: '1h'
             });




             // Generate a reset link with the token
             const resetLink = `${config.SITE_URL}/reset-password?token=${resetToken}`;


             // Store the reset token and its expiration time (e.g., 1 hour)
             user.email_verify_token = resetToken;
             user.token_expiry = new Date(Date.now() + 3600000); // 1 hour from now
             await user.save();

             // Send the verification email
             await sendPasswordResetEmail(email, resetLink);


             let data = helper.success(200, 'Password reset link sent to your email address.');
             return res.status(200).json(data);
         } catch (error) {
             console.error('Error in forgot password:', error);

             let data = helper.failed(500, 'Something went wrong. Please try again later.');
             return res.status(500).json(data);
         }
     };


     /*********************showResetPasswordPage********************/

     showResetPasswordPage = async (req, res) => {
         const {
             token
         } = req.query; // Retrieve the token from the URL

         try {
             // Verify the token (if you used JWT for tokens)
             const decoded = jwt.verify(token, config.JWT_SECRET_KEY);

             const user = await User.findOne({
                 where: {
                     email_verify_token: token
                 }
             });



             // Check if the token is valid
             //  if (!user || new Date() > new Date(user.token_expiry)) {
             //      return res.status(400).json({
             //          error: 'Invalid or expired reset token'
             //      });
             //  }

             if (!user) {
                 return res.status(400).json({
                     error: 'Invalid or expired reset token'
                 });
             }

             // Render the reset password form
             return res.render('reset-password', {
                 token
             }); // Pass the token to the EJS template
         } catch (error) {
             console.error('Error verifying token:', error);
             return res.status(500).json({
                 error: 'Something went wrong. Please try again later.'
             });
         }
     };


     /*********************resetPassword**************** ****/

     // Reset Password - Handle Form Submission
     resetPassword = async (req, res) => {
         const {
             token,
             newPassword,
             confirmPassword
         } = req.fields;


         if (newPassword !== confirmPassword) {
             return res.status(400).json({
                 error: 'Passwords do not match'
             });
         }

         try {
             // Find user by reset token
             const user = await User.findOne({
                 where: {
                     email_verify_token: token
                 }
             });

             // Check if the token is valid and not expired
             if (!user || new Date() > new Date(user.reset_token_expiry)) {
                 return res.status(400).json({
                     error: 'Invalid or expired reset token'
                 });
             }

             // Hash the new password
             const hashedPassword = await bcrypt.hash(newPassword, 10);

             // Update the user's password and clear reset token
             user.password = hashedPassword;
             user.email_verify_token = null;
             user.token_expiry = null;
             await user.save();

             // After successful reset, render the success page with a message
             return res.render('password-reset-success', {
                 message: 'Your password has been successfully reset. You can now log in.'
             });


         } catch (error) {
             console.error('Error resetting password:', error);
             return res.status(500).json({
                 error: 'Something went wrong. Please try again later.'
             });
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
                     //  {
                     //      model: db.user_categories, // Categories associated with user
                     //      as: 'userCategories', // Alias for categories model (you should use this alias based on the association)
                     //      required: false, // Categories are optional, so this can be false
                     //      include: [{
                     //          model: db.categories, // Include the associated category
                     //          as: 'categories', // Alias for category association in user_categories
                     //          attributes: ['id', 'name'] // Only include id and name from categories
                     //      }]

                     //  },
                     //  {
                     //      model: db.user_subcategories, // Categories associated with user
                     //      as: 'userSubCategories', // Alias for categories model (you should use this alias based on the association)
                     //      required: false, // Categories are optional, so this can be false

                     //  }
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