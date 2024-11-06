 const db = require("../models/index");
 const users = db.users;
 const helper = require('../utils/index');

class AuthController {
    /*********************Login**************** ****/
    userRegistration = async(req,res) => {
        try {
           let params = req.fields;
           let data= helper.success(200,'Data insert successfully !');
           return res.status(200).json(data);
        } catch (e) {
            console.log('ffffffffffffffffffffff');
        }
    }

  


    
}

module.exports = new AuthController();