// backend/app.js
import { connection } from "./bd.js";

export class App {
  async listarTodos() {
    const db = await connection();
    const rows = await db.all("SELECT * FROM estudante ORDER BY id");
    // não fechamos explicitamente o sqlite `open` connection porque o driver fecha ao terminar do processo,
    // mas, se quiser, pode usar db.close() (não necessário aqui).
    return rows;
  }

  async buscarPorId(id) {
    const db = await connection();
    const row = await db.get("SELECT * FROM estudante WHERE id = ?", [id]);
    return row || null;
  }

  async inserir(nome, email) {
    const db = await connection();
    const result = await db.run("INSERT INTO estudante (nome, email) VALUES (?, ?)", [nome, email]);
    return { id: result.lastID, nome, email };
  }

  async atualizar(id, nome, email) {
    const db = await connection();
    // atualiza apenas campos que vierem (evita sobrescrever com null)
    const atual = await this.buscarPorId(id);
    if (!atual) return { changed: 0 };

    const novoNome = (nome === undefined || nome === null || nome === "") ? atual.nome : nome;
    const novoEmail = (email === undefined || email === null || email === "") ? atual.email : email;

    const res = await db.run("UPDATE estudante SET nome = ?, email = ? WHERE id = ?", [novoNome, novoEmail, id]);
    return { changed: res.changes };
  }

  async deletar(id) {
    const db = await connection();
    const res = await db.run("DELETE FROM estudante WHERE id = ?", [id]);
    return { deleted: res.changes };
  }
}
