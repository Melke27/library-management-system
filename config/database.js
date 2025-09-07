const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || 'library_user',
  password: process.env.DB_PASSWORD || 'library_password',
  database: process.env.DB_NAME || 'library_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get promise-based pool
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Closing database connections...');
  pool.end(() => {
    console.log('✅ Database connections closed.');
    process.exit(0);
  });
});

module.exports = {
  pool,
  promisePool,
  testConnection
};
