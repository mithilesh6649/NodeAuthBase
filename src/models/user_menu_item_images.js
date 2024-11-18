// models/MenuItemImage.js

module.exports = (sequelize, DataTypes) => {
    const UserMenuItemImage = sequelize.define(
        "user_menu_item_images", // Use plural as per convention for table names
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_menu_item_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: "user_menu_items", // Should match the name of the UserMenuItem model
                    key: "id",
                },
                onDelete: "SET NULL", // Adjust as needed
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true, // Nullable to allow for images to be optional
            },
            status: {
                type: DataTypes.TINYINT,
                allowNull: true,
                defaultValue: 1, // Default is active
            },
        }, {
            tableName: "user_menu_item_images", // Use plural for table name for consistency
            timestamps: false, // Enable timestamps for createdAt and updatedAt
        }
    );

    // Define associations if needed
    // UserMenuItemImage.associate = (models) => {
    //   UserMenuItemImage.belongsTo(models.UserMenuItem, {
    //     foreignKey: "user_menu_item_id",
    //     as: "userMenuItem", // Optional alias for clarity
    //   });
    // };

    return UserMenuItemImage;
};