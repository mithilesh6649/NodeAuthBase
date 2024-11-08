module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("categories", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        image: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        status: {
            type: Sequelize.STRING(100),
            allowNull: true,
            defaultValue: '1' // Set default value to '1'
        },
    }, {
        timestamps: false
    });

    return Category;
};