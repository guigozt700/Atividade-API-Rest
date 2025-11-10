import { connection } from "./bd";

export interface Estudante {
  id: number;
  nome: string;
  email: string;
}

export class App {
  async listarTodos(): Promise<Estudante[]> {
    const db = await connection();
    return db.all<Estudante[]>("SELECT * FROM estudante ORDER BY id");
  }

  async buscarPorId(id: number): Promise<Estudante | null> {
    const db = await connection();
    const row = await db.get<Estudante>("SELECT * FROM estudante WHERE id = ?", [id]);
    return row || null;
  }

  async inserir(nome: string, email: string): Promise<Estudante> {
    const db = await connection();
    const result = await db.run("INSERT INTO estudante (nome, email) VALUES (?, ?)", [nome, email]);
    return { id: result.lastID!, nome, email };
  }

  async atualizar(id: number, nome?: string, email?: string) {
    const db = await connection();
    const atual = await this.buscarPorId(id);
    if (!atual) return { changed: 0 };

    const novoNome = nome || atual.nome;
    const novoEmail = email || atual.email;
    const res = await db.run("UPDATE estudante SET nome=?, email=? WHERE id=?", [novoNome, novoEmail, id]);
    return { changed: res.changes };
  }

  async deletar(id: number) {
    const db = await connection();
    const res = await db.run("DELETE FROM estudante WHERE id=?", [id]);
    return { deleted: res.changes };
  }
}
