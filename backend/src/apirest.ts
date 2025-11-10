import express from "express";
import cors from "cors";
import path from "path";
import { App } from "./app";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const publicDir = path.join(__dirname, "../../frontend/dist");
app.use(express.static(publicDir));

const dao = new App();

app.get("/usuarios", async (req, res) => {
  const dados = await dao.listarTodos();
  res.json(dados);
});

app.get("/usuarios/:id", async (req, res) => {
  const id = Number(req.params.id);
  const usuario = await dao.buscarPorId(id);
  usuario
    ? res.json(usuario)
    : res.status(404).json({ message: "Não encontrado" });
});

app.post("/usuarios", async (req, res) => {
  const { nome, email } = req.body;
  const novo = await dao.inserir(nome, email);
  res.status(201).json(novo);
});

app.put("/usuarios", async (req, res) => {
  const { id, nome, email } = req.body;
  const resultado = await dao.atualizar(Number(id), nome, email);
  res.json(resultado);
});

app.delete("/usuarios/:id", async (req, res) => {
  const id = Number(req.params.id);
  const resultado = await dao.deletar(id);
  res.json(resultado);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
