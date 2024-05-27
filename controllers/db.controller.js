const mysql = require('mysql2');

// Create a connection pool
const dbConfig = {
  port:"3306",
  host: "localhost", // Replace with your MySQL server host
  user: "root", // Replace with your MySQL username
  password: "", // Replace with your MySQL password
};
// Create a connection
const connection = mysql.createConnection(dbConfig);

// Connect to MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err);
    return;
  }
  console.log('Connected to MySQL server');

  // Check if the database exists, create it if not
  createDatabaseIfNotExists();
});

// Function to create the database if it doesn't exist
function createDatabaseIfNotExists() {
  connection.query('CREATE DATABASE IF NOT EXISTS laundry_db', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database "laundry_db" is ready');

    // Close the connection
    connection.end((endErr) => {
      if (endErr) {
        console.error('Error closing connection:', endErr);
      } else {
        console.log('Connection closed');
      }
    });
  });
}

// Re-create the connection pool with the database name specified
const pool = mysql.createPool({
  ...dbConfig,
  database: 'laundry_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();