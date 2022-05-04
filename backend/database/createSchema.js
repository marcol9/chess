import { db } from "./Connection.js";

const deleteMode = true;

if (deleteMode) {
  db.exec("DROP TABLE IF EXISTS users;");
}

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100),
    password VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(15),
    token VARCHAR(100)
)`);


//seed the database
if (deleteMode) {
  db.run(
    `INSERT INTO users (username,password,email,role,token) VALUES ('Marcelol', '$2b$10$UaHjJ6Gu3sIQU1Mr5ov9z.mRVUvjkxNz3urX2kWMfNYJq5dQfyxwK','marekslipnickis@inbox.lv','admin', null)`
  );
  db.run(
    `INSERT INTO users (username,password,email,role,token) VALUES ('Marcelol2', '$2b$10$UaHjJ6Gu3sIQU1Mr5ov9z.mRVUvjkxNz3urX2kWMfNYJq5dQfyxwK','marekslipnickis2@inbox.lv','user', null)`
  );
  db.run(
    `INSERT INTO users (username,password,email,role,token) VALUES ('Marcelol3', '$2b$10$UaHjJ6Gu3sIQU1Mr5ov9z.mRVUvjkxNz3urX2kWMfNYJq5dQfyxwK','marekslipnickis3@inbox.lv','user', null)`
  );
}
db.close();
