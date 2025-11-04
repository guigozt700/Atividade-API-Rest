// backend/apirest.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { App } from "./app.js";

const app = express();
const porta = 3000;

app.use(cors());
app.use(express.json());

// servir arquivos estáticos da pasta 'public'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "../public");
app.use(express.static(publicDir));

const dao = new App();

// listar todos
app.get("/usuarios", async (req, res) => {
  try {
    const dados = await dao.listarTodos();
    return res.status(200).json(dados);
  } catch (err) {
    console.error("Erro listar:", err);
    return res.status(500).json({ message: "Erro interno ao listar usuários." });
  }
});

// buscar por id
app.get("/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "ID inválido." });

    const usuario = await dao.buscarPorId(id);
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado." });
    return res.status(200).json(usuario);
  } catch (err) {
    console.error("Erro buscar por id:", err);
    return res.status(500).json({ message: "Erro interno ao buscar usuário." });
  }
});

// inserir
app.post("/usuarios", async (req, res) => {
  try {
    const { nome, email } = req.body;
    if (!nome || !email) return res.status(400).json({ message: "Nome e email obrigatórios." });
    const novo = await dao.inserir(nome, email);
    return res.status(201).json(novo);
  } catch (err) {
    console.error("Erro inserir:", err);
    return res.status(500).json({ message: "Erro interno ao inserir usuário." });
  }
});

// atualizar (body: { id, nome?, email? })
app.put("/usuarios", async (req, res) => {
  try {
    const { id, nome, email } = req.body;
    if (!id) return res.status(400).json({ message: "ID obrigatório para atualizar." });

    const resultado = await dao.atualizar(Number(id), nome, email);
    return res.status(200).json(resultado);
  } catch (err) {
    console.error("Erro atualizar:", err);
    return res.status(500).json({ message: "Erro interno ao atualizar usuário." });
  }
});

// deletar
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "ID inválido." });

    const resultado = await dao.deletar(id);
    if (resultado.deleted === 0) return res.status(404).json({ message: "Usuário não encontrado." });
    return res.status(204).send();
  } catch (err) {
    console.error("Erro deletar:", err);
    return res.status(500).json({ message: "Erro interno ao deletar usuário." });
  }
});

app.listen(porta, () => {
  console.log(`✅ API RESTful rodando em: http://localhost:${porta}`);
  console.log(`📂 Servindo arquivos estáticos em: ${publicDir}`);
});
