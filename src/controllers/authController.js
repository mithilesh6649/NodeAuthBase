 const db = require("../models/index");
 const users = db.users;
 const bcrypt = require("bcrypt");
 const helper = require('../utils/index');

 //  load Validation
 const {
     userValidator
 } = require('../validators');


 class AuthController {
     /*********************Login**************** ****/
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





 }

 module.exports = new AuthController();