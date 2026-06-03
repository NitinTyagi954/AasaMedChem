import dotenv from "dotenv";
import fs from "fs";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initDB() {
  try {
    console.log("Reading schema.sql...");
    const schema = fs.readFileSync("src/db/schema.sql", "utf8");
    
    console.log("Executing schema...");
    await pool.query(schema);
    
    console.log("Database tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    pool.end();
  }
}

initDB();