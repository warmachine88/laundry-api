const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://root:@localhost:3306/', {
  dialect: 'ysql',
  logging: false
});

async function createDatabaseIfNotExists() {
  try {
    // Check if the database exists
    const rawQuery = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'laundry_db'`;
    const [results] = await sequelize.query(rawQuery, { raw: true });

    if (results.length === 0) {
      // If the database doesn't exist, create it
      await sequelize.query('CREATE DATABASE IF NOT EXISTS laundry_db');
      console.log('Database "laundry_db" created successfully.');
    } else {
      console.log('Database "laundry_db" already exists.');
    }
  } catch (error) {
    console.error('Error creating database:', error);
  }
}

async function createTablesIfNotExists() {
  try {
    await sequelize.query(`USE laundry_db`);
    await sequelize.sync({ force: true }); // Create tables if they don't exist
    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

async function initDatabase() {
  await createDatabaseIfNotExists();
  await createTablesIfNotExists();
}

initDatabase();

module.exports = sequelize;