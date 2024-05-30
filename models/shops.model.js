const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Shops = sequelize.define('shops_tbl', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    logo: {
        type: DataTypes.BLOB,
        allowNull: false
    },
    tagline: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING
    },
    facebook: {
        type: DataTypes.STRING
    },
    services: {
        type: DataTypes.STRING, // You may want to consider using ENUM instead of STRING if services are predefined
        allowNull: false
    },
    contact: {
        type: DataTypes.JSON // Assuming contact will be an array of objects containing contact numbers and emails
    }
}, {
    tableName: 'shops_tbl',
    timestamps: false
});

module.exports = Shops;
