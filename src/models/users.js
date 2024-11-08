module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        role_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isIn: {
                    args: [
                        [1, 2, 3]
                    ],
                    msg: "role_id must be one of 1, 2, or 3"
                }
            }
        },
        first_name: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        last_name: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        phone_number: {
            type: Sequelize.INTEGER(100),
            allowNull: true
        },
        email: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address: {
            type: Sequelize.STRING(300),
            allowNull: true
        },
        address_line2: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        country: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        state: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        city: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        zip_code: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
    }, {
        timestamps: false
    });



    return Users;
};