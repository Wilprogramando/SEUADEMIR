const { useState, useEffect, useMemo, useRef, useCallback } = React;

/* ============================================================
   API
============================================================ */
const TOKEN_KEY = "recomeco_token";
const getToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; } };
const setToken = (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch (e) {} };

async function api(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = "Bearer " + token;
  const res = await fetch("/api" + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  let data = {};
  try { data = await res.json(); } catch (e) {}
  if (!res.ok) throw new Error(data.error || "Erro inesperado.");
  return data;
}

/* ============================================================
   ÍCONES (SVG inline — tema academia / vida saudável)
============================================================ */
const I = {
  dumbbell: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6.5 6.5 17.5 17.5"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>),
  heart: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>),
  apple: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 6.5c0-2 1-4 4-4 0 2.5-1.5 4-4 4Z"/><path d="M12 20c-3 0-5-2.5-5-6.5S9 7 12 7s5 2.5 5 6.5S15 20 12 20Z"/></svg>),
  droplet: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/></svg>),
  flame: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/></svg>),
  run: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="17" cy="4" r="2"/><path d="m15.5 9-3.5 2 2 4-3 4"/><path d="m8 13-2 1-3-1"/><path d="m12 11 4 1 1 4"/></svg>),
  salad: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7"/><path d="M13 12a2 2 0 0 0-2-2"/></svg>),
  calendar: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>),
  target: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>),
  wallet: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5"/></svg>),
  compass: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>),
  moon: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>),
  smile: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/></svg>),
  book: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>),
  logout: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>),
  feather: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"/><path d="M16 8 2 22M17.5 15H9"/></svg>),
  leaf: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>),
};

/* ============================================================
   DADOS DO MÉTODO
============================================================ */
const ETAPAS = [
  { n: 1, t: "Identidade e recomeço", d: "Construa uma nova identidade e pare de depender de motivação." },
  { n: 2, t: "Organização da rotina", d: "Transforme o caos em uma estrutura simples que cabe na sua vida." },
  { n: 3, t: "Plano alimentar de 14 dias", d: "Uma reinicialização leve e educativa da sua relação com a comida." },
  { n: 4, t: "Movimento de 20 minutos", d: "Treinos curtos, seguros e possíveis, mesmo nos dias cheios." },
  { n: 5, t: "Responsabilidade e constância", d: "O segredo de quem mantém os resultados a longo prazo." },
  { n: 6, t: "Energia, compras e finanças", d: "O suporte completo para sustentar a mudança, inclusive no bolso." },
];
const HABITOS = [
  { id: "water", label: "Bebi água ao acordar" },
  { id: "move", label: "Me movimentei 20 min" },
  { id: "meal", label: "Comi uma refeição planejada" },
  { id: "journal", label: "Anotei como me senti" },
  { id: "sleep", label: "Dormi no horário combinado" },
];
const MOVIMENTO = [
  { dia: 1, t: "Treino iniciante (20 min)", tipo: "treino" }, { dia: 2, t: "Caminhada 20–30 min", tipo: "leve" },
  { dia: 3, t: "Treino iniciante (20 min)", tipo: "treino" }, { dia: 4, t: "Descanso ativo — mobilidade 10 min", tipo: "descanso" },
  { dia: 5, t: "Treino iniciante / baixo impacto", tipo: "treino" }, { dia: 6, t: "Caminhada leve", tipo: "leve" },
  { dia: 7, t: "Descanso", tipo: "descanso" }, { dia: 8, t: "Treino iniciante / intermediário", tipo: "treino" },
  { dia: 9, t: "Caminhada 20–30 min", tipo: "leve" }, { dia: 10, t: "Treino intermediário / baixo impacto", tipo: "treino" },
  { dia: 11, t: "Descanso ativo — alongamento", tipo: "descanso" }, { dia: 12, t: "Treino intermediário (20 min)", tipo: "treino" },
  { dia: 13, t: "Caminhada leve", tipo: "leve" }, { dia: 14, t: "Descanso + reunião semanal", tipo: "descanso" },
];
const PLANO = [
 {d:1,c:"Ovos mexidos + 1 fruta + café/chá",a:"Frango grelhado + arroz + feijão + salada",l:"Iogurte natural + castanhas",j:"Omelete de legumes + salada"},
 {d:2,c:"Tapioca com queijo branco + fruta",a:"Peixe assado + batata-doce + brócolis + salada",l:"1 fruta + 2 ovos cozidos",j:"Sopa de legumes com frango desfiado"},
 {d:3,c:"Iogurte + aveia + frutas",a:"Carne magra + arroz + feijão + abobrinha + salada",l:"Pão integral + queijo branco + chá",j:"Frango grelhado + purê de abóbora + salada"},
 {d:4,c:"Ovos mexidos + tomate + fruta",a:"Frango ao molho de tomate + arroz + salada + cenoura",l:"Mix de castanhas + fruta",j:"Salada com atum, ovo, folhas e grão-de-bico"},
 {d:5,c:"Vitamina de banana com aveia",a:"Peixe grelhado + arroz + legumes no vapor + salada",l:"Iogurte + fruta",j:"Omelete com legumes + salada verde"},
 {d:6,c:"Pão integral + ovo + fruta",a:"Carne magra + mandioca + couve + salada",l:"Frutas + castanhas",j:"Sopa de legumes + fatia de pão integral"},
 {d:7,c:"Panqueca de banana e aveia + café",a:"Refeição livre na fórmula do prato equilibrado",l:"Iogurte + frutas",j:"Wrap integral com frango e salada"},
 {d:8,c:"Ovos + queijo branco + fruta",a:"Frango + quinoa/arroz + salada + legumes",l:"Fruta + iogurte natural",j:"Caldo de legumes com frango desfiado"},
 {d:9,c:"Iogurte + aveia + frutas",a:"Peixe + batata-doce + salada + brócolis",l:"Ovos cozidos + fruta",j:"Omelete de espinafre + salada"},
 {d:10,c:"Tapioca com ovo + fruta",a:"Carne magra + arroz + feijão + abóbora + salada",l:"Mix de castanhas + chá",j:"Salada com grão-de-bico, atum e folhas"},
 {d:11,c:"Vitamina de frutas com aveia",a:"Frango + arroz integral + legumes + salada",l:"Iogurte + fruta",j:"Sopa de abóbora com frango desfiado"},
 {d:12,c:"Pão integral + ovo mexido + fruta",a:"Peixe assado + purê de batata-doce + salada",l:"Frutas + castanhas",j:"Omelete de legumes + salada verde"},
 {d:13,c:"Iogurte + frutas + aveia",a:"Carne magra + mandioca + couve + salada",l:"Ovos cozidos + fruta",j:"Caldo de legumes + pão integral"},
 {d:14,c:"Panqueca de aveia e banana",a:"Refeição preferida na fórmula do prato",l:"Iogurte + frutas",j:"Wrap integral com proteína + salada"},
];
const RECEITAS = [
 ["Omelete de Legumes","10 min","Ovos, tomate, cebola, espinafre"],["Frango Grelhado Rápido","15 min","Filé de frango, alho, limão, azeite"],
 ["Tapioca com Ovo","8 min","Goma de tapioca, ovo, queijo branco"],["Vitamina Energética","5 min","Banana, aveia, leite, canela"],
 ["Salada Completa de Atum","10 min","Folhas, atum, ovo, tomate, grão-de-bico"],["Wrap Integral de Frango","12 min","Tortilha, frango desfiado, folhas"],
 ["Sopa Rápida de Legumes","20 min","Abobrinha, cenoura, batata, frango"],["Panqueca de Banana e Aveia","12 min","Banana, ovo, aveia, canela"],
 ["Ovos Mexidos com Tomate","8 min","Ovos, tomate, cebolinha"],["Frango ao Molho de Tomate","18 min","Frango, molho de tomate, manjericão"],
 ["Purê de Abóbora","18 min","Abóbora, alho, azeite"],["Salada de Grão-de-Bico","10 min","Grão-de-bico, tomate, pepino, limão"],
 ["Omelete de Espinafre","10 min","Ovos, espinafre, queijo branco"],["Peixe Grelhado com Limão","15 min","Peixe, limão, alho, azeite"],
 ["Iogurte com Frutas e Aveia","5 min","Iogurte, frutas, aveia"],["Refogado de Frango c/ Legumes","18 min","Frango, abobrinha, cenoura, alho"],
 ["Caldo de Abóbora","20 min","Abóbora, cebola, alho"],["Pão Integral c/ Ovo e Abacate","8 min","Pão integral, ovo, abacate"],
 ["Salada de Frango Desfiado","12 min","Frango, folhas, milho, cenoura"],["Mexido de Tofu","12 min","Tofu, cúrcuma, cebola, tomate"],
 ["Macarrão Integral Rápido","18 min","Macarrão integral, molho, frango"],["Crepioca Recheada","10 min","Ovo, goma, queijo, frango"],
 ["Sopa de Lentilha","20 min","Lentilha, cenoura, cebola, alho"],["Salada de Atum com Ovo","8 min","Atum, ovo, folhas, tomate"],
 ["Frango c/ Batata-Doce","20 min","Frango, batata-doce, alecrim"],["Smoothie Verde","5 min","Espinafre, banana, água de coco"],
 ["Omelete de Forno","18 min","Ovos, legumes, queijo"],["Wrap de Ovo e Folhas","8 min","Tortilha, ovo, folhas, tomate"],
 ["Salada Morna de Legumes","15 min","Brócolis, cenoura, abobrinha"],["Banana c/ Aveia e Amendoim","5 min","Banana, aveia, pasta de amendoim"],
];
const INDICADORES = [["energia","Energia"],["disposicao","Disposição"],["sono","Sono"],["roupas","Roupas vestindo"],["constancia","Constância"]];

/* ============================================================
   HELPERS DE DATA / ESTADO
============================================================ */
const todayKey = () => new Date().toISOString().slice(0, 10);
function weekKey(d = new Date()) { const dt = new Date(d); const day = (dt.getDay() + 6) % 7; dt.setDate(dt.getDate() - day); return dt.toISOString().slice(0, 10); }
const fmtBR = (k) => { if (!k) return ""; const [y, m, d] = k.split("-"); return `${d}/${m}/${y}`; };
const blankDay = () => ({ chk: {}, water: 0, sleep: { bed: "", wake: "", q: 0 }, mood: 0, moodNote: "", workout: { done: false, dur: "", effort: 0, note: "" }, food: { c: "", a: "", l: "", j: "" } });
function ensureDay(s, k) { if (!s.days[k]) s.days[k] = blankDay(); return s; }
function normalize(s) {
  // garante que o objeto tem todas as chaves esperadas (evita bugs com dados antigos)
  const base = { profile: { name: "" }, etapas: [false, false, false, false, false, false], days: {}, goals: {}, reviews: {}, plano: {}, mov: {}, finance: { entra: "", sai: "", deve: "", guardado: "", fuga: "", ajuste: "", gastos: [], reserva: { meta: "", semanal: "", atual: "" } }, commitment: { name: "", date: "", signed: false } };
  const out = Object.assign({}, base, s || {});
  out.profile = Object.assign({}, base.profile, s && s.profile);
  out.finance = Object.assign({}, base.finance, s && s.finance);
  out.finance.reserva = Object.assign({}, base.finance.reserva, s && s.finance && s.finance.reserva);
  out.finance.gastos = Array.isArray(out.finance.gastos) ? out.finance.gastos : [];
  out.commitment = Object.assign({}, base.commitment, s && s.commitment);
  if (!Array.isArray(out.etapas) || out.etapas.length !== 6) out.etapas = base.etapas.slice();
  out.days = out.days || {}; out.goals = out.goals || {}; out.reviews = out.reviews || {}; out.plano = out.plano || {}; out.mov = out.mov || {};
  return out;
}

/* ============================================================
   UI PRIMITIVOS
============================================================ */
const Card = ({ children, className = "" }) => <div className={"card " + className}>{children}</div>;
const Field = ({ label, children }) => (<label className="block mb-3"><span className="block text-sm font-semibold text-[var(--forest2)] mb-1">{label}</span>{children}</label>);
function Section({ title, sub, icon, children }) {
  const Icon = icon;
  return (<div className="fadein">
    <div className="flex items-center gap-3 mb-1">
      {Icon && <span className="w-10 h-10 rounded-xl btn-lime flex items-center justify-center"><Icon width="22" height="22" /></span>}
      <h2 className="display text-3xl md:text-4xl font-semibold text-[var(--forest)]">{title}</h2>
    </div>
    {sub && <p className="text-[var(--muted)] mb-6 max-w-2xl">{sub}</p>}
    {children}
  </div>);
}
function Stars({ value, onChange, n = 10 }) {
  return (<div className="flex flex-wrap gap-1.5">
    {Array.from({ length: n }).map((_, i) => { const v = i + 1; return (
      <button key={i} onClick={() => onChange(v === value ? 0 : v)}
        className={"chk w-8 h-8 rounded-full text-xs font-semibold border " + (v <= value ? "bg-[var(--clay)] text-white border-[var(--clay)]" : "bg-white text-[var(--muted)] border-[var(--line)]")}>{v}</button>); })}
  </div>);
}

/* ============================================================
   AUTENTICAÇÃO (login / registro)
============================================================ */
function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setErr(""); setBusy(true);
    try {
      const path = mode === "login" ? "/login" : "/register";
      const r = await api(path, { method: "POST", body: { username, password } });
      setToken(r.token);
      onAuth(r.username, r.token);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* lado visual */}
      <div className="auth-hero hidden md:flex flex-col justify-center px-12 text-[var(--cream)] relative">
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 rounded-2xl btn-lime flex items-center justify-center glow"><I.dumbbell width="26" height="26" /></span>
            <span className="display text-2xl font-semibold">Recomeço em Movimento</span>
          </div>
          <h1 className="display text-4xl leading-tight font-semibold mb-4">Energia, constância e controle da rotina — em poucos minutos por dia.</h1>
          <p className="opacity-80 mb-8">Seu sistema de treino, alimentação e hábitos saudáveis, tudo num lugar só.</p>
          <div className="flex flex-wrap gap-3 opacity-90">
            {[[I.run,"Movimento"],[I.salad,"Alimentação"],[I.droplet,"Hidratação"],[I.heart,"Bem-estar"],[I.target,"Metas"]].map(([Ic,lab],i)=>(
              <span key={i} className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 text-sm"><Ic width="16" height="16"/>{lab}</span>
            ))}
          </div>
        </div>
      </div>
      {/* formulário */}
      <div className="bg-app flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md p-8 pop">
          <div className="md:hidden flex items-center gap-2 mb-6 justify-center">
            <span className="w-10 h-10 rounded-xl btn-lime flex items-center justify-center"><I.dumbbell width="22" height="22" /></span>
            <span className="display text-xl font-semibold text-[var(--forest)]">Recomeço em Movimento</span>
          </div>
          <h2 className="display text-2xl font-semibold text-[var(--forest)] mb-1">{mode === "login" ? "Entrar" : "Criar conta"}</h2>
          <p className="text-sm text-[var(--muted)] mb-6">{mode === "login" ? "Acesse seu progresso." : "Comece seu recomeço agora."}</p>

          <Field label="Usuário">
            <input className="field-input" value={username} autoComplete="username"
              onChange={e => setU(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="seu_usuario" />
          </Field>
          <Field label="Senha">
            <input className="field-input" type="password" value={password} autoComplete={mode==="login"?"current-password":"new-password"}
              onChange={e => setP(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="mínimo 6 caracteres" />
          </Field>

          {err && <div className="text-sm text-[var(--clay2)] bg-[#ffefe9] border border-[#ffd9cc] rounded-xl px-3 py-2 mb-3">{err}</div>}

          <button onClick={submit} disabled={busy} className="btn-lime w-full py-3 chk disabled:opacity-60">
            {busy ? "Aguarde..." : (mode === "login" ? "Entrar" : "Criar conta")}
          </button>

          <p className="text-sm text-[var(--muted)] mt-4 text-center">
            {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
            <button className="font-semibold text-[var(--forest)] underline" onClick={() => { setErr(""); setMode(mode === "login" ? "register" : "login"); }}>
              {mode === "login" ? "Criar agora" : "Fazer login"}
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   APP PRINCIPAL (logado)
============================================================ */
function Dashboard({ username, token, onLogout }) {
  const [s, setS] = useState(null);
  const [tab, setTab] = useState("inicio");
  const [saveState, setSaveState] = useState("ok"); // ok | saving | error
  const saveTimer = useRef(null);
  const firstLoad = useRef(true);

  // carregar dados do servidor
  useEffect(() => {
    let alive = true;
    api("/data", { token })
      .then(r => { if (alive) setS(normalize(r.data)); })
      .catch(() => { if (alive) { setToken(null); onLogout(); } });
    return () => { alive = false; };
  }, [token]);

  // salvar (debounced) sempre que s mudar
  useEffect(() => {
    if (!s) return;
    if (firstLoad.current) { firstLoad.current = false; return; }
    setSaveState("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      api("/data", { method: "PUT", token, body: { data: s } })
        .then(() => setSaveState("ok"))
        .catch(() => setSaveState("error"));
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [s]);

  const update = useCallback((fn) => setS(prev => { const n = JSON.parse(JSON.stringify(prev)); fn(n); return n; }), []);

  if (!s) return (<div className="bg-app min-h-screen flex items-center justify-center text-[var(--muted)]">Carregando seu recomeço...</div>);

  const tk = todayKey(), wk = weekKey();
  const day = s.days[tk] || blankDay();

  const streak = useMemo(() => {
    let count = 0; const d = new Date();
    for (let i = 0; i < 400; i++) {
      const k = d.toISOString().slice(0, 10); const dd = s.days[k];
      const any = dd && (Object.values(dd.chk || {}).some(Boolean) || dd.water > 0 || (dd.workout && dd.workout.done));
      if (any) count++; else if (i > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [s.days]);

  const etapasDone = s.etapas.filter(Boolean).length;
  const habitsToday = HABITOS.filter(h => day.chk[h.id]).length;

  const NAV = [
    ["inicio", "Início", I.heart], ["etapas", "As 6 Etapas", I.compass], ["hoje", "Meu Dia", I.dumbbell],
    ["plano", "Plano 14 Dias", I.salad], ["movimento", "Movimento", I.run], ["receitas", "Receitas", I.apple],
    ["semana", "Revisão", I.calendar], ["metas", "Metas", I.target], ["financeiro", "Finanças", I.wallet], ["compromisso", "Compromisso", I.feather],
  ];

  const SaveBadge = () => (
    <span className={"text-[11px] px-2 py-0.5 rounded-full " + (saveState==="saving"?"bg-white/15":saveState==="error"?"bg-[var(--clay2)]":"bg-white/10")}>
      {saveState === "saving" ? "salvando..." : saveState === "error" ? "erro ao salvar" : "salvo ✓"}
    </span>
  );

  return (
    <div className="bg-app">
      <header className="sticky top-0 z-20 text-[var(--cream)]" style={{ background: "var(--grad)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl btn-lime flex items-center justify-center"><I.dumbbell width="20" height="20" /></span>
            <div>
              <div className="display text-lg leading-none font-semibold">Recomeço em Movimento</div>
              <div className="text-[11px] opacity-70 -mt-0.5 flex items-center gap-2">@{username} <SaveBadge /></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs opacity-85 hidden sm:block">
              <div className="flex items-center gap-1 justify-end"><I.flame width="13" height="13" /> {streak} {streak === 1 ? "dia" : "dias"}</div>
              <div>{fmtBR(tk)}</div>
            </div>
            <button onClick={onLogout} title="Sair" className="chk w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"><I.logout width="18" height="18" /></button>
          </div>
        </div>
        <nav style={{ background: "rgba(0,0,0,.18)" }}>
          <div className="max-w-6xl mx-auto px-2 flex gap-1 overflow-x-auto">
            {NAV.map(([id, label, Ic]) => (
              <button key={id} onClick={() => setTab(id)}
                className={"chk whitespace-nowrap px-3 py-2 my-1 rounded-lg text-sm font-medium flex items-center gap-1.5 " + (tab === id ? "nav-active" : "text-[var(--cream)]/80 hover:bg-white/10")}>
                <Ic width="15" height="15" />{label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {tab === "inicio" && <Inicio s={s} day={day} streak={streak} etapasDone={etapasDone} habitsToday={habitsToday} update={update} setTab={setTab} username={username} />}
        {tab === "etapas" && <Etapas s={s} update={update} />}
        {tab === "hoje" && <Hoje tk={tk} day={day} update={update} />}
        {tab === "plano" && <Plano s={s} update={update} />}
        {tab === "movimento" && <MovimentoView s={s} update={update} />}
        {tab === "receitas" && <Receitas />}
        {tab === "semana" && <Semana wk={wk} s={s} update={update} />}
        {tab === "metas" && <Metas wk={wk} s={s} update={update} />}
        {tab === "financeiro" && <Financeiro s={s} update={update} />}
        {tab === "compromisso" && <Compromisso s={s} update={update} />}
      </main>

      <footer className="max-w-6xl mx-auto px-4 pb-10 pt-2 text-xs text-[var(--muted)]">
        <p className="border-t border-[var(--line)] pt-4">Conteúdo educativo. Não substitui acompanhamento médico, nutricional, físico, psicológico ou financeiro. Resultados variam de pessoa para pessoa. Consulte profissionais antes de mudanças importantes.</p>
      </footer>
    </div>
  );
}

/* ---------- INÍCIO ---------- */
function Inicio({ s, day, streak, etapasDone, habitsToday, update, setTab, username }) {
  const nome = s.profile.name || username;
  const Stat = ({ Icon, big, label }) => (
    <Card className="p-5 flex items-center gap-4">
      <span className="w-12 h-12 rounded-2xl btn-lime flex items-center justify-center"><Icon width="24" height="24" /></span>
      <div><div className="display text-3xl font-bold text-[var(--forest)] leading-none">{big}</div><div className="text-sm text-[var(--muted)]">{label}</div></div>
    </Card>
  );
  return (
    <Section title={`Olá, ${nome}.`} sub="Constância, não perfeição. Um dia ruim não apaga uma semana boa." icon={I.heart}>
      {!s.profile.name && (
        <Card className="p-5 mb-6">
          <Field label="Como você quer ser chamada(o)?">
            <div className="flex gap-2">
              <input id="nm" className="field-input" placeholder="Seu nome" onKeyDown={e => { if (e.key === "Enter") update(n => n.profile.name = e.target.value); }} />
              <button onClick={() => { const v = document.getElementById("nm").value; if (v.trim()) update(n => n.profile.name = v.trim()); }} className="btn-primary px-4 py-2 chk">Salvar</button>
            </div>
          </Field>
        </Card>
      )}
      <div className="grid sm:grid-cols-3 gap-4 mb-6 stagger">
        <Stat Icon={I.flame} big={streak} label={streak === 1 ? "dia de constância" : "dias de constância"} />
        <Stat Icon={I.check} big={`${habitsToday}/5`} label="hábitos hoje" />
        <Stat Icon={I.compass} big={`${etapasDone}/6`} label="etapas concluídas" />
      </div>
      <Card className="p-6 mb-6">
        <h3 className="display text-2xl font-semibold text-[var(--forest)] mb-3 flex items-center gap-2"><I.check width="22" height="22" /> Checklist de hoje</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {HABITOS.map(h => (
            <button key={h.id} onClick={() => update(n => { ensureDay(n, todayKey()); n.days[todayKey()].chk[h.id] = !n.days[todayKey()].chk[h.id]; })}
              className={"chk flex items-center gap-3 p-3 rounded-xl border text-left " + (day.chk[h.id] ? "bg-[var(--forest)] text-white border-[var(--forest)]" : "bg-white border-[var(--line)]")}>
              <span className={"w-6 h-6 rounded-md flex items-center justify-center " + (day.chk[h.id] ? "bg-[var(--lime)] text-[#0d2016]" : "bg-[var(--cream2)]")}>{day.chk[h.id] && <I.check width="14" height="14" />}</span>
              <span className="font-medium">{h.label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setTab("hoje")} className="mt-4 text-sm font-semibold text-[var(--clay2)]">Abrir Meu Dia completo →</button>
      </Card>
      <Card className="p-6 text-[var(--cream)] relative overflow-hidden" style={{ background: "var(--grad)" }}>
        <I.leaf width="120" height="120" className="absolute -right-6 -bottom-8 opacity-10" />
        <p className="display text-xl italic leading-snug relative z-10">"Você não falhou. Você só nunca teve um sistema. Hoje isso muda."</p>
      </Card>
    </Section>
  );
}

/* ---------- ETAPAS ---------- */
function Etapas({ s, update }) {
  return (
    <Section title="As 6 etapas do método" sub="Suba um degrau de cada vez. Marque cada etapa conforme você a domina." icon={I.compass}>
      <div className="space-y-3 stagger">
        {ETAPAS.map((e, i) => (
          <Card key={e.n} className={"p-5 flex items-start gap-4 " + (s.etapas[i] ? "ring-gold" : "")}>
            <button onClick={() => update(n => n.etapas[i] = !n.etapas[i])}
              className={"chk shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center display text-lg font-bold " + (s.etapas[i] ? "btn-lime" : "bg-[var(--cream2)] text-[var(--forest)]")}>
              {s.etapas[i] ? <I.check width="22" height="22" /> : e.n}
            </button>
            <div><h3 className="display text-xl font-semibold text-[var(--forest)]">{e.t}</h3><p className="text-[var(--muted)] text-sm">{e.d}</p></div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* ---------- MEU DIA ---------- */
function Hoje({ tk, day, update }) {
  const set = (fn) => update(n => { ensureDay(n, tk); fn(n.days[tk]); });
  return (
    <Section title="Meu dia" sub={`Registros de ${fmtBR(tk)}. Tudo é salvo automaticamente na sua conta.`} icon={I.dumbbell}>
      <div className="grid md:grid-cols-2 gap-4 stagger">
        <Card className="p-5">
          <h3 className="display text-xl font-semibold text-[var(--forest)] mb-3 flex items-center gap-2"><I.check width="20" height="20" /> Hábitos</h3>
          {HABITOS.map(h => (
            <button key={h.id} onClick={() => set(d => d.chk[h.id] = !d.chk[h.id])}
              className={"chk w-full flex items-center gap-3 p-2.5 mb-2 rounded-xl border text-left " + (day.chk[h.id] ? "bg-[var(--forest)] text-white border-[var(--forest)]" : "bg-white border-[var(--line)]")}>
              <span className={"w-5 h-5 rounded flex items-center justify-center " + (day.chk[h.id] ? "bg-[var(--lime)] text-[#0d2016]" : "bg-[var(--cream2)]")}>{day.chk[h.id] && <I.check width="12" height="12" />}</span>
              <span className="text-sm font-medium">{h.label}</span>
            </button>
          ))}
        </Card>
        <Card className="p-5">
          <h3 className="display text-xl font-semibold text-[var(--forest)] mb-2 flex items-center gap-2"><I.droplet width="20" height="20" /> Água</h3>
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => set(d => d.water = Math.max(0, d.water - 1))} className="chk w-10 h-10 rounded-full bg-[var(--cream2)] text-xl font-bold">–</button>
            <span className="display text-4xl font-bold text-[var(--forest)] w-16 text-center">{day.water}</span>
            <button onClick={() => set(d => d.water += 1)} className="chk w-10 h-10 rounded-full btn-lime text-xl font-bold">+</button>
            <span className="text-sm text-[var(--muted)]">copos hoje</span>
          </div>
          <div className="flex gap-1 flex-wrap">{Array.from({ length: Math.max(8, day.water) }).map((_, i) => <I.droplet key={i} width="18" height="18" className={i < day.water ? "text-[var(--lime2)]" : "text-[var(--cream2)]"} />)}</div>
        </Card>
        <Card className="p-5">
          <h3 className="display text-xl font-semibold text-[var(--forest)] mb-3 flex items-center gap-2"><I.moon width="20" height="20" /> Sono</h3>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Field label="Deitei"><input type="time" className="field-input" value={day.sleep.bed} onChange={e => set(d => d.sleep.bed = e.target.value)} /></Field>
            <Field label="Acordei"><input type="time" className="field-input" value={day.sleep.wake} onChange={e => set(d => d.sleep.wake = e.target.value)} /></Field>
          </div>
          <span className="block text-sm font-semibold text-[var(--forest2)] mb-1">Qualidade</span>
          <Stars value={day.sleep.q} onChange={v => set(d => d.sleep.q = v)} />
        </Card>
        <Card className="p-5">
          <h3 className="display text-xl font-semibold text-[var(--forest)] mb-3 flex items-center gap-2"><I.smile width="20" height="20" /> Humor</h3>
          <Stars value={day.mood} onChange={v => set(d => d.mood = v)} />
          <textarea className="field-input mt-3" rows="2" placeholder="O que influenciou meu humor?" value={day.moodNote} onChange={e => set(d => d.moodNote = e.target.value)} />
        </Card>
        <Card className="p-5">
          <h3 className="display text-xl font-semibold text-[var(--forest)] mb-3 flex items-center gap-2"><I.run width="20" height="20" /> Treino</h3>
          <button onClick={() => set(d => d.workout.done = !d.workout.done)}
            className={"chk px-4 py-2 rounded-xl font-semibold mb-3 " + (day.workout.done ? "btn-lime" : "bg-[var(--cream2)] text-[var(--forest)]")}>
            {day.workout.done ? "✓ Treino feito" : "Marcar treino feito"}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Duração (min)"><input className="field-input" value={day.workout.dur} onChange={e => set(d => d.workout.dur = e.target.value)} placeholder="20" /></Field>
            <div><span className="block text-sm font-semibold text-[var(--forest2)] mb-1">Esforço</span><Stars value={day.workout.effort} onChange={v => set(d => d.workout.effort = v)} /></div>
          </div>
          <textarea className="field-input mt-2" rows="2" placeholder="Como me senti no treino?" value={day.workout.note} onChange={e => set(d => d.workout.note = e.target.value)} />
        </Card>
        <Card className="p-5">
          <h3 className="display text-xl font-semibold text-[var(--forest)] mb-3 flex items-center gap-2"><I.salad width="20" height="20" /> Diário alimentar</h3>
          {[["c", "Café da manhã"], ["a", "Almoço"], ["l", "Lanche"], ["j", "Jantar"]].map(([k, lab]) => (
            <Field key={k} label={lab}><input className="field-input" value={day.food[k]} onChange={e => set(d => d.food[k] = e.target.value)} placeholder="O que comi" /></Field>
          ))}
        </Card>
      </div>
    </Section>
  );
}

/* ---------- PLANO 14 DIAS ---------- */
function Plano({ s, update }) {
  const togglePlano = (d) => update(n => { if (!n.plano) n.plano = {}; n.plano[d] = !n.plano[d]; });
  return (
    <Section title="Plano alimentar de 14 dias" sub="Sugestões educativas e flexíveis. Use as substituições livremente. Não é prescrição — consulte um nutricionista para necessidades específicas." icon={I.salad}>
      <div className="grid md:grid-cols-2 gap-3 stagger">
        {PLANO.map(p => (
          <Card key={p.d} className={"p-4 " + (s.plano[p.d] ? "ring-gold" : "")}>
            <div className="flex items-center justify-between mb-2">
              <span className="display text-lg font-semibold text-[var(--forest)]">Dia {p.d}</span>
              <button onClick={() => togglePlano(p.d)} className={"chk text-xs px-3 py-1 rounded-full font-semibold " + (s.plano[p.d] ? "btn-lime" : "bg-[var(--cream2)] text-[var(--forest)]")}>{s.plano[p.d] ? "✓ cumprido" : "marcar"}</button>
            </div>
            <ul className="text-sm space-y-1">
              <li><b className="text-[var(--clay2)]">Café:</b> {p.c}</li>
              <li><b className="text-[var(--clay2)]">Almoço:</b> {p.a}</li>
              <li><b className="text-[var(--clay2)]">Lanche:</b> {p.l}</li>
              <li><b className="text-[var(--clay2)]">Jantar:</b> {p.j}</li>
            </ul>
          </Card>
        ))}
      </div>
      <Card className="p-5 mt-4">
        <h3 className="display text-lg font-semibold text-[var(--forest)] mb-1">Substituições</h3>
        <p className="text-sm text-[var(--muted)]">Proteínas entre si (frango ↔ peixe ↔ ovos ↔ carne magra ↔ leguminosas). Carboidratos entre si (arroz ↔ batata-doce ↔ mandioca ↔ quinoa ↔ pão integral). Use frutas e vegetais da estação. Laticínios ↔ versões vegetais sem açúcar.</p>
      </Card>
    </Section>
  );
}

/* ---------- MOVIMENTO ---------- */
function MovimentoView({ s, update }) {
  const cor = { treino: "var(--clay)", leve: "var(--gold)", descanso: "var(--forest2)" };
  const toggle = (d) => update(n => { if (!n.mov) n.mov = {}; n.mov[d] = !n.mov[d]; });
  return (
    <Section title="Calendário de movimento — 14 dias" sub="20 minutos por dia, com descanso planejado. Exercícios seguros e adaptáveis. Pare diante de dor aguda e consulte um profissional se precisar." icon={I.run}>
      <div className="grid sm:grid-cols-2 gap-3 stagger">
        {MOVIMENTO.map(m => (
          <Card key={m.dia} className="p-4 flex items-center gap-3">
            <button onClick={() => toggle(m.dia)} className={"chk shrink-0 w-11 h-11 rounded-2xl display font-bold text-white flex items-center justify-center " + (s.mov[m.dia] ? "" : "opacity-40")} style={{ background: cor[m.tipo] }}>{s.mov[m.dia] ? <I.check width="20" height="20" /> : m.dia}</button>
            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--muted)]">Dia {m.dia} · {m.tipo}</div>
              <div className="font-medium">{m.t}</div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-5 mt-4">
        <h3 className="display text-lg font-semibold text-[var(--forest)] mb-2">Estrutura de cada sessão (20 min)</h3>
        <p className="text-sm">3 min de aquecimento → 14 min de treino principal em circuito (força, mobilidade, condicionamento leve) → 3 min de volta à calma com alongamentos. Sempre há versão mais fácil de cada exercício; comece simples e progrida só quando estiver confortável.</p>
      </Card>
    </Section>
  );
}

/* ---------- RECEITAS ---------- */
function Receitas() {
  const [q, setQ] = useState("");
  const list = RECEITAS.filter(r => r[0].toLowerCase().includes(q.toLowerCase()) || r[2].toLowerCase().includes(q.toLowerCase()));
  return (
    <Section title="30 receitas rápidas" sub="Todas em até 20 minutos, com ingredientes acessíveis." icon={I.apple}>
      <input className="field-input mb-4 max-w-sm" placeholder="Buscar por nome ou ingrediente..." value={q} onChange={e => setQ(e.target.value)} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((r, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-[var(--forest)] leading-tight">{r[0]}</h3>
              <span className="chip shrink-0 ml-2">{r[1]}</span>
            </div>
            <p className="text-sm text-[var(--muted)]">{r[2]}</p>
          </Card>
        ))}
        {list.length === 0 && <p className="text-[var(--muted)] text-sm">Nenhuma receita encontrada.</p>}
      </div>
    </Section>
  );
}

/* ---------- REVISÃO SEMANAL ---------- */
function Semana({ wk, s, update }) {
  const r = s.reviews[wk] || { funcionou: "", travou: "", ajustar: "", orgulho: "", ind: {} };
  const set = (fn) => update(n => { if (!n.reviews[wk]) n.reviews[wk] = { funcionou: "", travou: "", ajustar: "", orgulho: "", ind: {} }; fn(n.reviews[wk]); });
  return (
    <Section title="Reunião semanal comigo mesma" sub={`Semana de ${fmtBR(wk)}. 10 minutos de conversa gentil com você mesma.`} icon={I.calendar}>
      <Card className="p-5 mb-4">
        <h3 className="display text-xl font-semibold text-[var(--forest)] mb-3">Meus 5 indicadores</h3>
        <div className="space-y-3">
          {INDICADORES.map(([k, lab]) => (
            <div key={k}><span className="text-sm font-semibold text-[var(--forest2)]">{lab}</span><Stars value={(r.ind && r.ind[k]) || 0} onChange={v => set(o => { if (!o.ind) o.ind = {}; o.ind[k] = v; })} /></div>
          ))}
        </div>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5"><Field label="O que funcionou esta semana?"><textarea rows="3" className="field-input" value={r.funcionou} onChange={e => set(o => o.funcionou = e.target.value)} /></Field></Card>
        <Card className="p-5"><Field label="O que travou?"><textarea rows="3" className="field-input" value={r.travou} onChange={e => set(o => o.travou = e.target.value)} /></Field></Card>
        <Card className="p-5"><Field label="O que vou ajustar?"><textarea rows="3" className="field-input" value={r.ajustar} onChange={e => set(o => o.ajustar = e.target.value)} /></Field></Card>
        <Card className="p-5"><Field label="Do que me orgulho?"><textarea rows="3" className="field-input" value={r.orgulho} onChange={e => set(o => o.orgulho = e.target.value)} /></Field></Card>
      </div>
    </Section>
  );
}

/* ---------- METAS ---------- */
function Metas({ wk, s, update }) {
  const goals = s.goals[wk] || [];
  const add = () => update(n => { if (!n.goals[wk]) n.goals[wk] = []; if (n.goals[wk].length < 5) n.goals[wk].push({ text: "", done: false }); });
  return (
    <Section title="Metas da semana" sub={`Semana de ${fmtBR(wk)}. Poucas metas, específicas e possíveis. Metas pequenas vencidas geram confiança.`} icon={I.target}>
      <div className="space-y-2 mb-4">
        {goals.map((g, i) => (
          <Card key={i} className="p-3 flex items-center gap-3">
            <button onClick={() => update(n => n.goals[wk][i].done = !n.goals[wk][i].done)} className={"chk w-7 h-7 rounded-md flex items-center justify-center " + (g.done ? "btn-lime" : "bg-[var(--cream2)]")}>{g.done && <I.check width="14" height="14" />}</button>
            <input className={"flex-1 bg-transparent outline-none " + (g.done ? "line-through text-[var(--muted)]" : "")} placeholder="Escreva sua meta..." value={g.text} onChange={e => update(n => n.goals[wk][i].text = e.target.value)} />
            <button onClick={() => update(n => n.goals[wk].splice(i, 1))} className="text-[var(--muted)] hover:text-[var(--clay2)] px-2">✕</button>
          </Card>
        ))}
        {goals.length === 0 && <p className="text-[var(--muted)] text-sm">Nenhuma meta ainda. Adicione até 5.</p>}
      </div>
      {goals.length < 5 && <button onClick={add} className="btn-primary px-4 py-2 chk">+ Adicionar meta</button>}
    </Section>
  );
}

/* ---------- FINANCEIRO ---------- */
function Financeiro({ s, update }) {
  const f = s.finance;
  const setF = (fn) => update(n => fn(n.finance));
  const num = (v) => (parseFloat(String(v).replace(",", ".")) || 0);
  const totalGastos = (f.gastos || []).reduce((a, g) => a + num(g.val), 0);
  const saldo = num(f.entra) - num(f.sai);
  return (
    <Section title="Retomada financeira" sub="Educativo. Não substitui consultoria financeira, não promete enriquecimento. Foco em clareza e controle." icon={I.wallet}>
      <Card className="p-5 mb-4">
        <h3 className="display text-xl font-semibold text-[var(--forest)] mb-3">Diagnóstico</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Quanto entra por mês (R$)"><input className="field-input" value={f.entra} onChange={e => setF(x => x.entra = e.target.value)} /></Field>
          <Field label="Quanto sai por mês (R$)"><input className="field-input" value={f.sai} onChange={e => setF(x => x.sai = e.target.value)} /></Field>
          <Field label="Quanto devo no total (R$)"><input className="field-input" value={f.deve} onChange={e => setF(x => x.deve = e.target.value)} /></Field>
          <Field label="Quanto tenho guardado (R$)"><input className="field-input" value={f.guardado} onChange={e => setF(x => x.guardado = e.target.value)} /></Field>
          <Field label="Minha maior fuga de dinheiro"><input className="field-input" value={f.fuga} onChange={e => setF(x => x.fuga = e.target.value)} /></Field>
          <Field label="Ajuste que faria mais diferença"><input className="field-input" value={f.ajuste} onChange={e => setF(x => x.ajuste = e.target.value)} /></Field>
        </div>
        <div className={"mt-2 text-sm font-semibold " + (saldo >= 0 ? "text-[var(--forest)]" : "text-[var(--clay2)]")}>Saldo mensal estimado: R$ {saldo.toFixed(2)}</div>
      </Card>
      <Card className="p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="display text-xl font-semibold text-[var(--forest)]">Controle de gastos</h3>
          <span className="text-sm text-[var(--muted)]">Total: <b className="text-[var(--clay2)]">R$ {totalGastos.toFixed(2)}</b></span>
        </div>
        <GastoForm onAdd={(g) => setF(x => { if (!x.gastos) x.gastos = []; x.gastos.unshift(g); })} />
        <div className="mt-3 space-y-1 max-h-72 overflow-auto">
          {(f.gastos || []).map((g, i) => (
            <div key={i} className="flex items-center gap-2 text-sm py-1.5 border-b border-[var(--line)]">
              <span className="text-[var(--muted)] w-16">{g.date}</span>
              <span className="flex-1">{g.desc}</span>
              <span className="chip">{g.cat}</span>
              <span className="font-semibold w-20 text-right">R$ {num(g.val).toFixed(2)}</span>
              <button onClick={() => setF(x => x.gastos.splice(i, 1))} className="text-[var(--muted)] hover:text-[var(--clay2)]">✕</button>
            </div>
          ))}
          {(f.gastos || []).length === 0 && <p className="text-sm text-[var(--muted)]">Nenhum gasto registrado ainda.</p>}
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="display text-xl font-semibold text-[var(--forest)] mb-3">Reserva de emergência</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Meta inicial (R$)"><input className="field-input" value={f.reserva.meta} onChange={e => setF(x => x.reserva.meta = e.target.value)} /></Field>
          <Field label="Guardo por semana (R$)"><input className="field-input" value={f.reserva.semanal} onChange={e => setF(x => x.reserva.semanal = e.target.value)} /></Field>
          <Field label="Tenho hoje (R$)"><input className="field-input" value={f.reserva.atual} onChange={e => setF(x => x.reserva.atual = e.target.value)} /></Field>
        </div>
        {num(f.reserva.meta) > 0 && (
          <div className="mt-2">
            <div className="h-3 rounded-full bg-[var(--cream2)] overflow-hidden"><div className="h-full" style={{ width: Math.min(100, num(f.reserva.atual) / num(f.reserva.meta) * 100) + "%", background: "linear-gradient(90deg,var(--lime),var(--lime2))" }}></div></div>
            <div className="text-xs text-[var(--muted)] mt-1">{Math.min(100, Math.round(num(f.reserva.atual) / num(f.reserva.meta) * 100))}% da meta</div>
          </div>
        )}
      </Card>
    </Section>
  );
}
function GastoForm({ onAdd }) {
  const [desc, setDesc] = useState(""), [val, setVal] = useState(""), [cat, setCat] = useState("Alimentação");
  const cats = ["Moradia", "Alimentação", "Transporte", "Contas", "Lazer", "Dívidas", "Outros"];
  return (
    <div className="flex flex-wrap gap-2 items-end">
      <input className="field-input flex-1 min-w-[140px]" placeholder="Descrição" value={desc} onChange={e => setDesc(e.target.value)} />
      <select className="field-input w-36" value={cat} onChange={e => setCat(e.target.value)}>{cats.map(c => <option key={c}>{c}</option>)}</select>
      <input className="field-input w-28" placeholder="Valor R$" value={val} onChange={e => setVal(e.target.value)} />
      <button onClick={() => { if (desc && val) { onAdd({ date: fmtBR(todayKey()).slice(0, 5), desc, cat, val }); setDesc(""); setVal(""); } }} className="btn-primary px-4 py-2 chk">Adicionar</button>
    </div>
  );
}

/* ---------- COMPROMISSO ---------- */
function Compromisso({ s, update }) {
  const c = s.commitment;
  return (
    <Section title="Meu compromisso pessoal" sub="Uma decisão escrita e assinada tem outro peso." icon={I.feather}>
      <Card className="p-6 md:p-8 max-w-2xl mx-auto text-center ring-gold">
        <p className="display text-xl md:text-2xl leading-relaxed text-[var(--forest)]">
          Eu, <input className="border-b-2 border-[var(--clay)] bg-transparent text-center display font-semibold px-2 w-40 outline-none" placeholder="seu nome" value={c.name} onChange={e => update(n => n.commitment.name = e.target.value)} />, me comprometo a cuidar de mim com <b>constância</b>, e não com perfeição. A me mover, a me alimentar com cuidado, a recomeçar sempre que tropeçar e a tratar a mim mesma com gentileza. A partir de hoje, eu não recomeço do zero: eu <b>continuo</b>.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <input type="date" className="field-input w-44" value={c.date} onChange={e => update(n => n.commitment.date = e.target.value)} />
          <button onClick={() => update(n => n.commitment.signed = !n.commitment.signed)}
            className={"chk px-6 py-3 rounded-full font-semibold " + (c.signed ? "btn-primary" : "btn-lime")}>
            {c.signed ? "✓ Compromisso assinado" : "Assinar meu compromisso"}
          </button>
          {c.signed && <p className="text-sm text-[var(--muted)] fadein flex items-center gap-1"><I.leaf width="15" height="15" /> Seu recomeço já começou. Agora é só continuar em movimento.</p>}
        </div>
      </Card>
    </Section>
  );
}

/* ============================================================
   RAIZ
============================================================ */
function App() {
  const [auth, setAuth] = useState(null); // {username, token}
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const t = getToken();
    if (!t) { setChecking(false); return; }
    api("/me", { token: t })
      .then(r => setAuth({ username: r.username, token: t }))
      .catch(() => setToken(null))
      .finally(() => setChecking(false));
  }, []);

  function logout() { setToken(null); setAuth(null); }

  if (checking) return <div className="bg-app min-h-screen flex items-center justify-center text-[var(--muted)]">Carregando...</div>;
  if (!auth) return <Auth onAuth={(username, token) => setAuth({ username, token })} />;
  return <Dashboard username={auth.username} token={auth.token} onLogout={logout} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
