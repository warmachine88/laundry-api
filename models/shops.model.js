const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Shops = sequelize.define('shops_tbl', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
    name: {
        type: DataTypes.STRING,
        
    },
    logo: {
        type: DataTypes.STRING,
        
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
        
    },
    contact: {
        type: DataTypes.JSON // Assuming contact will be an array of objects containing contact numbers and emails
    }
}, {
    tableName: 'shops_tbl',
    timestamps: false
});

module.exports = Shops;
