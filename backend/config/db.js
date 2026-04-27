import pkg from "pg";
const { Pool } = pkg;

import dotenv from "dotenv";

dotenv.config();

const db = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "PgAdmin",
  database: process.env.DB_NAME || "instantsearch",
  ssl:
    process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false }
      : false,
});

// Test database connection
db.connect()
  .then(() => {
    console.log("PostgreSQL connected");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

export default db;