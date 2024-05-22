// booking.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Booking = sequelize.define('tbl_booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  service: {
    type: DataTypes.JSON,
    allowNull: false
  },
  contact_no: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reservation_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  return_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zip_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time_delivery: {
    type: DataTypes.TIME,
    allowNull: false
  },
  weights: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_of_bills: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'booking_tbl',
  timestamps: false
});

module.exports = Booking;
