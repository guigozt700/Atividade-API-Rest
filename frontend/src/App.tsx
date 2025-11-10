import { useEffect, useState } from "react";
import api from "./services/api";

interface Usuario {
  id?: number;
  nome: string;
  email: string;
}

function App() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState<Usuario>({ nome: "", email: "" });
  const [editando, setEditando] = useState<number | null>(null);

  // ✅ Carregar lista ao abrir
  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const res = await api.get<Usuario[]>("/usuarios");
      setUsuarios(res.data);
    } catch {
      alert("Erro ao carregar usuários");
    }
  }

  // ✅ Inserir novo usuário
  async function adicionarUsuario() {
    if (!form.nome || !form.email) {
      alert("Preencha nome e email!");
      return;
    }

    try {
      await api.post("/usuarios", form);
      setForm({ nome: "", email: "" });
      carregarUsuarios();
    } catch {
      alert("Erro ao adicionar usuário");
    }
  }

  // ✅ Atualizar
  async function atualizarUsuario() {
    if (!editando) return;
    try {
      await api.put("/usuarios", { id: editando, ...form });
      setEditando(null);
      setForm({ nome: "", email: "" });
      carregarUsuarios();
    } catch {
      alert("Erro ao atualizar usuário");
    }
  }

  // ✅ Deletar
  async function deletarUsuario(id: number) {
    if (!confirm("Deseja realmente excluir?")) return;
    try {
      await api.delete(`/usuarios/${id}`);
      carregarUsuarios();
    } catch {
      alert("Erro ao deletar usuário");
    }
  }

  // ✅ Editar
  function editarUsuario(u: Usuario) {
    setEditando(u.id!);
    setForm({ nome: u.nome, email: u.email });
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Painel de Usuários</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          style={{ marginRight: "8px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ marginRight: "8px" }}
        />
        {editando ? (
          <button onClick={atualizarUsuario}>💾 Atualizar</button>
        ) : (
          <button onClick={adicionarUsuario}>➕ Adicionar</button>
        )}
        {editando && (
          <button onClick={() => {
            setEditando(null);
            setForm({ nome: "", email: "" });
          }}>❌ Cancelar</button>
        )}
      </div>

      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            <strong>{u.nome}</strong> — {u.email}{" "}
            <button onClick={() => editarUsuario(u)}>✏️ Editar</button>{" "}
            <button onClick={() => deletarUsuario(u.id!)}>🗑️ Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
