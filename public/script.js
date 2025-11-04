const API = "/usuarios"; // mesmo host/porta do backend

function preencheCampos(obj) {
  if (!obj) return;
  document.getElementById("id").value = obj.id ?? "";
  document.getElementById("nome").value = obj.nome ?? "";
  document.getElementById("email").value = obj.email ?? "";
}

async function listar() {
  const res = await fetch(API);
  const dados = await res.json();
  const tbody = document.getElementById("tabela-corpo");
  tbody.innerHTML = "";
  dados.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${u.id}</td><td>${u.nome}</td><td>${u.email}</td>`;
    tr.onclick = () => preencheCampos(u);
    tbody.appendChild(tr);
  });
}

async function buscar() {
  const id = document.getElementById("id").value;
  if (!id) return alert("Informe ID");
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) return alert("Usuário não encontrado");
  const dados = await res.json();
  preencheCampos(dados);
}

async function inserir() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  if (!nome || !email) return alert("Preencha nome e email");
  const res = await fetch(API, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ nome, email })
  });
  if (!res.ok) return alert("Erro ao inserir");
  await listar();
  alert("Inserido");
}

async function atualizar() {
  const id = document.getElementById("id").value;
  if (!id) return alert("Informe ID para atualizar");
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const res = await fetch(API, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ id: Number(id), nome, email })
  });
  if (!res.ok) return alert("Erro ao atualizar");
  await listar();
  alert("Atualizado");
}

async function deletar() {
  const id = document.getElementById("id").value;
  if (!id) return alert("Informe ID para deletar");
  if (!confirm("Confirma exclusão?")) return;
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  if (res.status === 204) {
    await listar();
    alert("Deletado");
  } else {
    alert("Erro ao deletar");
  }
}

// ligar botões
document.getElementById("btn-listar").onclick = listar;
document.getElementById("btn-buscar").onclick = buscar;
document.getElementById("btn-inserir").onclick = inserir;
document.getElementById("btn-atualizar").onclick = atualizar;
document.getElementById("btn-deletar").onclick = deletar;

// lista ao carregar
listar();
