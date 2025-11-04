// backend/bd.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function connection() {
  // abre (ou cria) o arquivo ./backend/dados.db
  const db = await open({
    filename: "./backend/dados.db",
    driver: sqlite3.Database
  });

  // garante que a tabela exista
  await db.exec(`
    CREATE TABLE IF NOT EXISTS estudante (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      email TEXT
    );
  `);

  // opcional: insere registros iniciais apenas se a tabela estiver vazia
  const row = await db.get("SELECT COUNT(*) as c FROM estudante");
  if (row && row.c === 0) {
    await db.run("INSERT INTO estudante (nome, email) VALUES (?, ?)", ["Bruno", "bruno@example.com"]);
    await db.run("INSERT INTO estudante (nome, email) VALUES (?, ?)", ["Vivian", "vivian@example.com"]);
    await db.run("INSERT INTO estudante (nome, email) VALUES (?, ?)", ["Marco", "marco@example.com"]);
  }

  return db;
}
