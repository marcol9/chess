import sqlite3 from "sqlite3";
import { open } from "sqlite";

// this is a top-level await
// open the database
export const db = await open({
  filename: "elzone.db",
  driver: sqlite3.Database,
});
