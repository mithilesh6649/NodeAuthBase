module.exports = (sequelize, Sequelize) => {
    const UserTiming = sequelize.define("user_timings", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        day_name: {
            type: Sequelize.INTEGER, // Assuming this refers to a day of the week (1 to 7 or other integer system)
            allowNull: true
        },
        start_time: {
            type: Sequelize.TIME,
            allowNull: true
        },
        end_time: {
            type: Sequelize.TIME,
            allowNull: true
        },
        status: {
            type: Sequelize.INTEGER, // Assuming this field represents an integer status (e.g., 1 for active)
            allowNull: true,
            defaultValue: 1
        },
        day_id: {
            type: Sequelize.INTEGER(10), // Set the length to 10 characters as per your schema
            allowNull: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: true, // Assuming this references the user in a users table
            references: {
                model: 'users', // Assuming you have a `users` table
                key: 'id' // The primary key in the `users` table
            }
        }
    }, {
        timestamps: false // Assuming you don't need timestamps for this model
    });

    // Define relationships (associations) if applicable

    // If you have a `User` model:
    // UserTiming.associate = (models) => {
    //     // Each user timing belongs to a user
    //     UserTiming.belongsTo(models.User, {
    //         foreignKey: 'user_id',
    //         as: 'user' // Alias for accessing the related User
    //     });

    //     // If you have a `Day` model (optional):
    //     UserTiming.belongsTo(models.Day, {
    //         foreignKey: 'day_id',
    //         as: 'day' // Alias for accessing the related Day
    //     });
    // };

    return UserTiming;
};