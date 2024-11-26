const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log("MySQL Connected...");
    connection.release();
  } catch (err) {
    console.error("MySQL Connection Error: ", err);
  }
})();

module.exports = db;
