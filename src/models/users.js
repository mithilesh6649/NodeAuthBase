module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(150),
            allowNull: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        timestamps: false
    });

    return Users;
};