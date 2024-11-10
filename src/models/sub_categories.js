module.exports = (sequelize, Sequelize) => {
    const SubCategory = sequelize.define("sub_categories", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(10), // Set the length to 10 characters as per your schema
            allowNull: true
        },
        category_id: {
            type: Sequelize.INTEGER,
            allowNull: true, // Can be null, based on your schema
            references: {
                model: 'categories', // The model name being referenced
                key: 'id' // The key in the 'categories' table that this references
            }
        },
        status: {
            type: Sequelize.INTEGER, // Set type to INTEGER as per your schema
            allowNull: false,
            defaultValue: 1 // Default value set to 1 as per your schema
        }
    }, {
        timestamps: false // Assuming you don't need timestamps
    });

    // Define the relationship (one-to-many) between Category and SubCategory
    // SubCategory.associate = (models) => {
    //     // Each SubCategory belongs to a single Category
    //     SubCategory.belongsTo(models.Category, {
    //         foreignKey: 'category_id',
    //         as: 'category' // alias for the relation
    //     });
    // };

    return SubCategory;
};