// frontend/src/pages/Estudantes.tsx
import { useEffect, useState } from "react";
import api from "../src/services/api";

interface Estudante {
  id: number;
  nome: string;
  email: string;
}

export default function Estudantes() {
  const [dados, setDados] = useState<Estudante[]>([]);
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");

  async function carregar() {
    const resposta = await api.get("/usuarios");
    setDados(resposta.data);
  }

  async function adicionar() {
    if (!novoNome || !novoEmail) return;
    await api.post("/usuarios", { nome: novoNome, email: novoEmail });
    setNovoNome("");
    setNovoEmail("");
    carregar();
  }

  async function deletar(id: number) {
    await api.delete(`/usuarios/${id}`);
    carregar();
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>📘 Painel de Estudantes</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Nome"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          style={{ padding: 6, marginRight: 8 }}
        />
        <input
          placeholder="E-mail"
          value={novoEmail}
          onChange={(e) => setNovoEmail(e.target.value)}
          style={{ padding: 6, marginRight: 8 }}
        />
        <button onClick={adicionar}>Adicionar</button>
      </div>

      <table border={1} cellPadding={8} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.nome}</td>
              <td>{e.email}</td>
              <td>
                <button onClick={() => deletar(e.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
