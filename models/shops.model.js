const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Import the sequelize instance

const Shop = sequelize.define('Shop', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tagline: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  facebook: {
    type: DataTypes.STRING,
    allowNull: true
  },
  services: {
    type: DataTypes.JSON, // Use JSON type to store array of strings
    allowNull: true
  },
  contact: {
    type: DataTypes.JSON, // Assuming you store contact info as JSON
    allowNull: true
  }
}, {
  tableName: 'shops_tbl',
  timestamps: false // If you don't need timestamps
});

// Ensure that the table is created if it doesn't exist
(async () => {
    try {
        await sequelize.sync();
        console.log("Table 'shops_tbl' created (if not exists) successfully.");
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
})();

module.exports = Shop;
