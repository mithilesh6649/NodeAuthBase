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
  SITE_URL: process.env.SITE_URL,
  mailer: {
    MAIL_MAILER: process.env.MAIL_MAILER,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USERNAME: process.env.MAIL_USERNAME,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_ENCRYPTION: process.env.MAIL_ENCRYPTION,
    MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
    MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
    SECURE: false,
  }
};
module.exports = config;