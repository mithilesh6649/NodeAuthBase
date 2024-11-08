module.exports = (sequelize, Sequelize) => {
    const UserCategory = sequelize.define("user_categories", {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Name of the Users table
                key: 'id' // The primary key of the Users table
            }
        },
        category_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'categories', // Name of the Categories table
                key: 'id' // The primary key of the Categories table
            }
        }
    }, {
        timestamps: false // Optional, if you don't want timestamps
    });

    return UserCategory;
};