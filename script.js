const KEY = "vagas-estagio-v1";

const seed = [
  { id: 1, cargo: "Estágio em Desenvolvimento Web", empresa: "TechNova", area: "Tecnologia", local: "Fortaleza/CE", modal: "Híbrido", bolsa: "1.500", contato: "rh@technova.com", desc: "Apoio no desenvolvimento de sites com HTML, CSS e JavaScript." },
  { id: 2, cargo: "Estágio em Marketing Digital", empresa: "Brisa Comunicação", area: "Marketing", local: "Remoto", modal: "Remoto", bolsa: "1.200", contato: "vagas@brisa.com", desc: "Criação de conteúdo e análise de métricas." }
];

let vagas = [];
try {
  const s = localStorage.getItem(KEY);
  vagas = s ? JSON.parse(s) : seed;
} catch (e) {
  vagas = seed;
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(vagas)); } catch (e) {}
}

function esc(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function contato(c) {
  return /^https?:\/\//i.test(c)
    ? `<a href="${esc(c)}" target="_blank" rel="noopener">Candidatar-se</a>`
    : esc(c);
}

function render() {
  const q = document.getElementById("q").value.toLowerCase();
  const list = vagas.filter(v => [v.cargo, v.empresa, v.local, v.area].join(" ").toLowerCase().includes(q));
  const tb = document.getElementById("tb");

  tb.innerHTML = list.length
    ? list.map(v => `<tr>
        <td><b>${esc(v.cargo)}</b><br><small style="color:var(--mu)">${esc(v.modal)}${v.desc ? " · " + esc(v.desc) : ""}</small></td>
        <td>${esc(v.empresa)}</td>
        <td><span class="tag">${esc(v.area)}</span></td>
        <td>${esc(v.local)}</td>
        <td>${v.bolsa ? "R$ " + esc(v.bolsa) : "—"}</td>
        <td>${contato(v.contato)}</td>
        <td><button class="del" data-id="${v.id}">Remover</button></td>
      </tr>`).join("")
    : `<tr><td colspan="7" class="empty">Nenhuma vaga encontrada.</td></tr>`;

  document.getElementById("n").textContent = vagas.length;
  document.getElementById("e").textContent = new Set(vagas.map(v => v.empresa.toLowerCase())).size;
}

document.getElementById("enviar").onclick = () => {
  const g = id => document.getElementById(id).value.trim();
  const f = document.getElementById("f");
  if (!f.reportValidity()) return;

  vagas.unshift({
    id: Date.now(),
    cargo: g("cargo"), empresa: g("empresa"), area: g("area"), local: g("local"),
    modal: g("modal"), bolsa: g("bolsa"), contato: g("contato"), desc: g("desc")
  });

  save();
  render();
  f.reset();

  const ok = document.getElementById("ok");
  ok.style.display = "block";
  setTimeout(() => ok.style.display = "none", 4000);
  document.getElementById("vagas").scrollIntoView();
};

document.getElementById("tb").onclick = e => {
  const id = e.target.dataset.id;
  if (id && confirm("Remover esta vaga?")) {
    vagas = vagas.filter(v => String(v.id) !== id);
    save();
    render();
  }
};

document.getElementById("q").oninput = render;
render();