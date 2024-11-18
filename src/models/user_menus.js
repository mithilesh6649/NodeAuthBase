// models/UserMenus.js

module.exports = (sequelize, DataTypes) => {
    const UserMenus = sequelize.define(
        "user_menus", // Use plural as per convention for table names
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users", // Assumes there is a 'users' table
                    key: "id",
                },
                onDelete: "CASCADE", // If a user is deleted, cascade delete the menu
                index: true, // Add an index for faster lookup
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "categories", // Assumes there is a 'categories' table
                    key: "id",
                },
                onDelete: "CASCADE", // If a category is deleted, cascade delete the menu
                index: true, // Add an index for faster lookup
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: true,
                validate: {
                    len: [0, 255], // Title length validation
                },
            },
            description: {
                type: DataTypes.STRING(500),
                allowNull: true,
                validate: {
                    len: [0, 500], // Description length validation
                },
            },
            status: {
                type: DataTypes.TINYINT,
                allowNull: true,
                defaultValue: 1, // Default status is active
            },
        }, {
            timestamps: false, // Set to true if you need timestamps (createdAt, updatedAt)
        }
    );

    // Define associations between UserMenus and Users, Categories
    UserMenus.associate = function (models) {
        // A UserMenu belongs to a User
        UserMenus.belongsTo(models.users, {
            foreignKey: "user_id",
            as: "user", // Optional alias for the association
        });

        // // A UserMenu belongs to a Category
        UserMenus.belongsTo(models.categories, {
            foreignKey: "category_id",
            as: "category", // Optional alias for the association
        });

        // // A UserMenu belongs to a Category
        UserMenus.hasMany(models.user_menu_items, {
            foreignKey: "user_menu_id",
            as: "user_menu_items", // Optional alias for the association
        });
    };

    return UserMenus;
};