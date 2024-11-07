const dotenv = require('dotenv');
dotenv.config();

let config = {
  debug: false,
  PORT: process.env.PORT,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  database: {
    DB_HOST: process.env.DB_HOST,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_USERNAME,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_CONNECTION: process.env.DB_CONNECTION,
    DB_PORT: process.env.DB_PORT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },

  poolid: "#",
  smtp: {
    // host:"smtp.gmail.com",
    // port:"587",
    // user:"demo.ebizzinfotech@gmail.com",
    // pass:"hspwogqssrpwvtpy",
    // secure: false
  }
};
module.exports = config;