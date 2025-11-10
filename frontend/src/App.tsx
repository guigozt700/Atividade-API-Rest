import { useEffect, useState } from "react";
import api from "./services/api";

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export default function App() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [erro, setErro] = useState("");

  async function carregarUsuarios() {
    try {
      const res = await api.get<Usuario[]>("/usuarios");
      setUsuarios(res.data);
    } catch {
      setErro("Erro ao carregar usuários.");
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function salvarUsuario(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editando) {
        await api.put("/usuarios", { id: editando.id, nome, email });
      } else {
        await api.post("/usuarios", { nome, email });
      }
      setNome("");
      setEmail("");
      setEditando(null);
      await carregarUsuarios();
    } catch {
      setErro("Erro ao salvar usuário.");
    }
  }

  async function excluirUsuario(id: number) {
    if (confirm("Deseja realmente excluir este usuário?")) {
      try {
        await api.delete(`/usuarios/${id}`);
        await carregarUsuarios();
      } catch {
        setErro("Erro ao excluir usuário.");
      }
    }
  }

  function editarUsuario(u: Usuario) {
    setEditando(u);
    setNome(u.nome);
    setEmail(u.email);
  }

  return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "60px 20px",
        }}
      >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          padding: "40px 50px",
          width: "100%",
          maxWidth: "650px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#4A4A4A",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          👥 Painel de Usuários
        </h1>

        <form
          onSubmit={salvarUsuario}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome"
            required
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "15px",
            }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite o e-mail"
            required
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "15px",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#6C63FF",
              color: "white",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#594AE2")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#6C63FF")
            }
          >
            {editando ? "💾 Salvar Alterações" : "➕ Adicionar Usuário"}
          </button>

          {editando && (
            <button
              type="button"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#E0E0E0",
                color: "#333",
                fontWeight: "bold",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                setEditando(null);
                setNome("");
                setEmail("");
              }}
            >
              Cancelar Edição
            </button>
          )}
        </form>

        {erro && (
          <div
            style={{
              background: "#ff4d4d",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            {erro}
          </div>
        )}

        <div style={{ textAlign: "left" }}>
          {usuarios.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#777",
                marginTop: "10px",
                fontSize: "15px",
              }}
            >
              Nenhum usuário cadastrado.
            </p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {usuarios.map((u) => (
                <li
                  key={u.id}
                  style={{
                    backgroundColor: "#F9F9F9",
                    borderRadius: "12px",
                    padding: "15px 20px",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                >
                  <div>
                    <strong style={{ color: "#333", fontSize: "16px" }}>
                      {u.nome}
                    </strong>
                    <br />
                    <span style={{ color: "#777", fontSize: "14px" }}>
                      {u.email}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => editarUsuario(u)}
                      style={{
                        background: "#63B3ED",
                        border: "none",
                        color: "white",
                        borderRadius: "8px",
                        padding: "5px 10px",
                        marginRight: "8px",
                        cursor: "pointer",
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => excluirUsuario(u.id)}
                      style={{
                        background: "#FF6B6B",
                        border: "none",
                        color: "white",
                        borderRadius: "8px",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
