const { Sequelize } = require('sequelize');

// Initialize Sequelize instance with database credentials
const sequelize = new Sequelize('mysql://root:@localhost:3306/laundry_db', {
  dialect: 'mysql',
});

async function createDatabaseIfNotExists() {
  try {
    // Check if the database exists
    const rawQuery = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'laundry_db'`;
    const [results] = await sequelize.query(rawQuery, { raw: true });

    if (results.length === 0) {
      // If the database doesn't exist, create it
      await sequelize.query('CREATE DATABASE laundry_db');
      console.log('Database "laundry_db" created successfully.');
    } else {
      console.log('Database "laundry_db" already exists.');
    }
  } catch (error) {
    console.error('Error creating database:', error);
  }
}

// Call the function to create the database if it doesn't exist
createDatabaseIfNotExists()
  .then(() => {
    console.log('Database check completed.');
  })
  .catch(error => {
    console.error('Error checking database:', error);
  });

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
