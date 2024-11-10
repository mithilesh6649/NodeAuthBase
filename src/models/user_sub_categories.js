module.exports = (sequelize, Sequelize) => {
    const UserSubcategories = sequelize.define("user_subcategories", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false, // user_id cannot be null
            references: {
                model: 'users', // Table name in the database
                key: 'id' // Primary key of the users table
            },
            onDelete: 'CASCADE' // If the user is deleted, delete the related subcategory data
        },
        category_id: {
            type: Sequelize.INTEGER,
            allowNull: false, // category_id cannot be null
            references: {
                model: 'categories', // Table name in the database
                key: 'id' // Primary key of the categories table
            },
            onDelete: 'CASCADE' // If the category is deleted, delete the related subcategory data
        },
        subcategory_id: {
            type: Sequelize.INTEGER,
            allowNull: false, // subcategory_id cannot be null
            references: {
                model: 'subcategories', // Table name in the database
                key: 'id' // Primary key of the subcategories table
            },
            onDelete: 'CASCADE' // If the subcategory is deleted, delete the related user-subcategory data
        }
    }, {
        timestamps: false // Assuming you don't need `createdAt` and `updatedAt` fields
    });



    return UserSubcategories;
};