const config = require("../config/config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.database.DB_DATABASE,config.database.DB_USERNAME,config.database.DB_PASSWORD, {
    host:config.database.DB_HOST,
    logging:false,  
    dialect:config.database.DB_CONNECTION /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  });


  try {
   sequelize.authenticate();
   console.log('Connection has been established successfully.',config.database.DB_DATABASE);
 } catch (error) {
   console.error('Unable to connect to the database:', error);
 }

 const db = {};
 db.Sequelize = Sequelize;
 db.sequelize = sequelize;

 
 db.users = require("./users")(sequelize, Sequelize);

 module.exports=db;
