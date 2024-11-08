const config = require("../config/config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.database.DB_DATABASE, config.database.DB_USERNAME, config.database.DB_PASSWORD, {
  host: config.database.DB_HOST,
  logging: false,
  dialect: config.database.DB_CONNECTION /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});


try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.', config.database.DB_DATABASE);
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.users = require("./users")(sequelize, Sequelize);
db.categories = require("./category")(sequelize, Sequelize);
db.user_categories = require("./user_categories")(sequelize, Sequelize);
db.user_details = require("./user_details")(sequelize, Sequelize);


// One-to-One Relationship: A user has one user_detail
db.users.hasOne(db.user_details, {
  foreignKey: 'user_id', // user_id in user_details table
  as: 'userDetail' // Alias for user detail association
});


// User Model
db.users.belongsToMany(db.categories, {
  through: db.user_categories, // Intermediary table
  foreignKey: 'user_id', // Foreign key in the user_categories table for users
  as: 'categories' // Alias to access categories from user
});

// Category Model
db.categories.belongsToMany(db.users, {
  through: db.user_categories, // Intermediary table
  foreignKey: 'category_id', // Foreign key in the user_categories table for categories
  as: 'users' // Alias to access users from category
});



module.exports = db;