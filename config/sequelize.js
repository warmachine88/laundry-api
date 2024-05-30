const { Sequelize } = require('sequelize');

// Initial connection without specifying database
const sequelizeWithoutDB = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

// Function to create the database if it doesn't exist
async function createDatabaseIfNotExists() {
  try {
    const sequelizeRoot = new Sequelize(
      '', // No database specified
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
      }
    );

    // Check if the database exists
    const rawQuery = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${process.env.DB_NAME}'`;
    const [results] = await sequelizeRoot.query(rawQuery, { raw: true });

    if (results.length === 0) {
      // If the database doesn't exist, create it
      await sequelizeRoot.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      console.log(`Database "${process.env.DB_NAME}" created successfully.`);
    } else {
      console.log(`Database "${process.env.DB_NAME}" already exists.`);
    }

    await sequelizeRoot.close();
  } catch (error) {
    console.error('Error creating database:', error);
  }
}

// Function to create tables if they don't exist
async function createTablesIfNotExists() {
  try {
    await sequelizeWithoutDB.query(`USE ${process.env.DB_NAME}`);
    await sequelizeWithoutDB.sync(); // Create tables if they don't exist
    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Initialize the database
async function initDatabase() {
  await createDatabaseIfNotExists();
  await createTablesIfNotExists();
}

initDatabase();

module.exports = sequelizeWithoutDB;
