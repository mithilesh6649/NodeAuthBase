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
db.user_timings = require("./user_timings")(sequelize, Sequelize);
db.sub_categories = require("./sub_categories")(sequelize, Sequelize);
db.user_timings = require("./user_timings")(sequelize, Sequelize);
db.user_subcategories = require("./user_sub_categories")(sequelize, Sequelize);

db.user_menus = require("./user_menus")(sequelize, Sequelize);
db.user_menu_items = require("./user_menu_item")(sequelize, Sequelize);
db.user_menu_item_images = require("./MenuItemImage")(sequelize, Sequelize);
//Menus




// One-to-One Relationship: A user has one user_detail
db.users.hasOne(db.user_details, {
  foreignKey: 'user_id', // user_id in user_details table
  as: 'userDetail' // Alias for user detail association
});


db.users.hasMany(db.user_categories, {
  foreignKey: 'user_id', // user_id in user_details table
  as: 'userCategories' // Alias for user detail association
});


db.user_categories.belongsTo(db.categories, {
  foreignKey: 'category_id',
  as: 'categories' // Alias for accessing category details
});

db.users.hasMany(db.user_subcategories, {
  foreignKey: 'user_id', // user_id in user_details table
  as: 'userSubCategories' // Alias for user detail association
});







db.categories.hasMany(db.sub_categories, {
  foreignKey: 'category_id', // The foreign key in sub_categories table
  as: 'sub_categories' // Alias for accessing subcategories from category
});

// Sub Categories
db.sub_categories.belongsTo(db.categories, {
  foreignKey: 'category_id', // Foreign key in the sub_categories table for categories
  as: 'categories' // Alias to access the category from a subcategory
});



// Menu..........

// db.user_menus.belongsTo(db.users, {
//   foreignKey: "user_id"
// });
// db.user_menus.belongsTo(db.categories, {
//   foreignKey: "category_id"
// });


// Initialize associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


module.exports = db;