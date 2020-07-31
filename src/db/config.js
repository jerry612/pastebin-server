const sqlite3 = require("sqlite3").verbose();

const createTable = () => {
  console.log("create database table posts");
  db.run(
    "CREATE TABLE IF NOT EXISTS posts (id INTEGER AUTO_INCREMENT, uuid TEXT PRIMARY KEY, cipher_text TEXT, expiration INTEGER, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP)"
  );
};

let db = new sqlite3.Database("./src/db/database.sqlite", err => {
  if (err) {
    console.log("Error when creating the database", err);
  } else {
    console.log("Database created!");
    /* Put code to create table(s) here */
    createTable();
  }
});

// db.run("INSERT INTO users (username, password) VALUES (?, ?)", [
//   "fargin",
//   "prince"
// ]);

module.exports = db;
