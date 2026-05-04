import "dotenv/config";
import mysql from "mysql2/promise.js";

const host = process.env.DB_HOST || process.env.HOST || "localhost";
const user = process.env.DB_USER || process.env.USER;
const password = process.env.DB_PASSWORD || process.env.PASSWORD || "";
const database = process.env.DB_NAME || process.env.DATABASE;

if (!user || !database) {
    throw new Error(
        "Database configuration is missing. Set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in your .env file."
    );
}

const pool = mysql.createPool({
    host,
    user,
    password,
    database
});

export default pool;
