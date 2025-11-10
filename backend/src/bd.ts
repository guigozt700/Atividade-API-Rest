import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";


export async function connection(): Promise<Database> {
  const db = await open({
    filename: path.resolve(__dirname, "../dados.db"),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS estudante (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      email TEXT
    );
  `);

  const row = await db.get<{ c: number }>("SELECT COUNT(*) as c FROM estudante");
  if (row && row.c === 0) {
    await db.run("INSERT INTO estudante (nome, email) VALUES (?, ?)", ["Bruno", "bruno@example.com"]);
    await db.run("INSERT INTO estudante (nome, email) VALUES (?, ?)", ["Vivian", "vivian@example.com"]);
    await db.run("INSERT INTO estudante (nome, email) VALUES (?, ?)", ["Marco", "marco@example.com"]);
  }

  return db;
}
