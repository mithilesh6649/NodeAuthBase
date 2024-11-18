// models/UserMenuItem.js

module.exports = (sequelize, DataTypes) => {
    const UserMenuItem = sequelize.define(
        "user_menu_items", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_menu_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: "UserMenus",
                    key: "id",
                },
                onDelete: "SET NULL",
            },
            category_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: "categories", // Assumes you have a Category model
                    key: "id",
                },
                onDelete: "SET NULL", // Adjust as needed
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            item_type: {
                type: DataTypes.STRING,
                allowNull: true,
                comment: "Veg | Non Veg",
            },
            is_gluten_free: {
                type: DataTypes.STRING,
                allowNull: true,
                // defaultValue: false, // Default to false (non-gluten-free)
                comment: "Gluten Free | Non-Gluten Free",
            },
            // inventory: {
            //   type: DataTypes.INTEGER,
            //   allowNull: true,
            // },
            price: {
                type: DataTypes.DECIMAL(10, 2), // Precision 10, scale 2
                allowNull: true,
            },
            status: {
                type: DataTypes.TINYINT,
                allowNull: true,
                defaultValue: 1, // Default active status
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: "Users", // Assumes you have a User model
                    key: "id",
                },
                onDelete: "SET NULL", // Adjust as needed
            },
        }, {
            tableName: "user_menu_items", // Explicitly set the table name
            timestamps: false, // Disable timestamps for createdAt and updatedAt
        }
    );

    // Define associations if needed
    UserMenuItem.associate = (models) => {
        UserMenuItem.belongsTo(models.users, {
            foreignKey: "user_id"
        });
        UserMenuItem.belongsTo(models.categories, {
            foreignKey: "category_id"
        });
        UserMenuItem.belongsTo(models.user_menus, {
            foreignKey: "user_menu_id"
        })
        UserMenuItem.hasMany(models.user_menu_item_images, {
            foreignKey: "user_menu_item_id"
        });
    };

    return UserMenuItem;
};