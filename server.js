/**
 * Método Recomeço em Movimento — Servidor
 * Node.js + Express + SQLite + autenticação (bcrypt + JWT).
 * Cada usuário tem login/senha próprios e seus dados ficam salvos no banco.
 */
const path = require("path");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;
// Em produção, defina JWT_SECRET como variável de ambiente (string longa e aleatória).
const JWT_SECRET = process.env.JWT_SECRET || "troque-este-segredo-por-um-valor-longo-e-aleatorio";

// ---------- Banco de dados ----------
const db = new Database(path.join(__dirname, "data.db"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS app_data (
    user_id INTEGER PRIMARY KEY,
    data    TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Consultas preparadas (previne SQL injection)
const Q = {
  findUser:   db.prepare("SELECT * FROM users WHERE username = ?"),
  findById:   db.prepare("SELECT id, username FROM users WHERE id = ?"),
  insertUser: db.prepare("INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)"),
  getData:    db.prepare("SELECT data FROM app_data WHERE user_id = ?"),
  upsertData: db.prepare(`INSERT INTO app_data (user_id, data) VALUES (?, ?)
                          ON CONFLICT(user_id) DO UPDATE SET data = excluded.data`),
};

const emptyState = JSON.stringify({
  profile: { name: "" },
  etapas: [false, false, false, false, false, false],
  days: {}, goals: {}, reviews: {},
  plano: {}, mov: {},
  finance: { entra: "", sai: "", deve: "", guardado: "", fuga: "", ajuste: "", gastos: [], reserva: { meta: "", semanal: "", atual: "" } },
  commitment: { name: "", date: "", signed: false },
});

// ---------- Middlewares ----------
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Não autenticado." });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.uid;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Sessão inválida ou expirada." });
  }
}

function makeToken(user) {
  return jwt.sign({ uid: user.id, username: user.username }, JWT_SECRET, { expiresIn: "30d" });
}

function validCreds(username, password) {
  if (typeof username !== "string" || typeof password !== "string") return "Dados inválidos.";
  username = username.trim();
  if (username.length < 3 || username.length > 30) return "O usuário deve ter de 3 a 30 caracteres.";
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) return "Use apenas letras, números, ponto, hífen ou underline no usuário.";
  if (password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
  return null;
}

// ---------- Rotas de autenticação ----------
app.post("/api/register", (req, res) => {
  try {
    let { username, password } = req.body || {};
    const err = validCreds(username, password);
    if (err) return res.status(400).json({ error: err });
    username = username.trim();

    if (Q.findUser.get(username)) {
      return res.status(409).json({ error: "Esse usuário já existe. Tente outro ou faça login." });
    }
    const hash = bcrypt.hashSync(password, 10);
    const info = Q.insertUser.run(username, hash, new Date().toISOString());
    const user = { id: info.lastInsertRowid, username };
    Q.upsertData.run(user.id, emptyState);

    return res.json({ token: makeToken(user), username });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erro no servidor." });
  }
});

app.post("/api/login", (req, res) => {
  try {
    let { username, password } = req.body || {};
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Dados inválidos." });
    }
    username = username.trim();
    const user = Q.findUser.get(username);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: "Usuário ou senha incorretos." });
    }
    return res.json({ token: makeToken(user), username: user.username });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erro no servidor." });
  }
});

app.get("/api/me", auth, (req, res) => {
  const user = Q.findById.get(req.userId);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
  res.json({ username: user.username });
});

// ---------- Rotas de dados ----------
app.get("/api/data", auth, (req, res) => {
  const row = Q.getData.get(req.userId);
  const data = row ? JSON.parse(row.data) : JSON.parse(emptyState);
  res.json({ data });
});

app.put("/api/data", auth, (req, res) => {
  try {
    const data = req.body && req.body.data;
    if (typeof data !== "object" || data === null) {
      return res.status(400).json({ error: "Formato de dados inválido." });
    }
    Q.upsertData.run(req.userId, JSON.stringify(data));
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao salvar." });
  }
});

// Fallback para a SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Recomeço em Movimento rodando em http://localhost:${PORT}`);
});
