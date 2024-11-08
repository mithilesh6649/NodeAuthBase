module.exports = (sequelize, Sequelize) => {
    const UserDetail = sequelize.define("user_details", {
        user_id: {
            type: Sequelize.BIGINT(20).UNSIGNED,
            allowNull: false,
            references: {
                model: 'users', // Referring to the 'users' table
                key: 'id'
            },
            onDelete: 'CASCADE', // If a user is deleted, the related details are also deleted
        },
        vendor_name: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        vendor_description: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        vendor_logo: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        contact_first_name: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        contact_middle_name: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        contact_last_name: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        contact_suffix: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        contact_phone: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        address: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        city: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        state: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        zip_code: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        country: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        budget: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        client_size_min: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        client_size_max: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        food_license_url: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        id_image_url: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        service_image_url: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
    }, {
        timestamps: false,
        tableName: 'user_details'
    });



    return UserDetail;
};