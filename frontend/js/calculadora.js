/* Calculadora de orçamento
   Os valores de referência abaixo são estimativas — ajuste-os à realidade do mercado. */

const CUSTO_POR_CONVIDADO = { economico: 12000, medio: 25000, premium: 55000 }; // Kz por pessoa
const FACTOR_PROVINCIA = { Luanda: 1 };  // outras províncias usam 0.85
const FACTOR_OUTRAS = 0.85;

// Distribuição (%) por grupo de evento
const DISTRIBUICOES = {
  social: { espacos: 22, catering: 32, decoracao: 12, fotografia: 10, musica: 6, trajes: 6, bolos: 4, beleza: 3, convites: 2, transporte: 3 },
  corporativo: { espacos: 30, catering: 35, musica: 10, fotografia: 8, decoracao: 8, convites: 3, cerimonia: 6 },
  infantil: { espacos: 25, catering: 30, animacao: 18, decoracao: 12, bolos: 10, fotografia: 5 }
};
const GRUPO = (tipo) =>
  ["corporativo", "conferencia", "lancamento", "gala", "workshop"].includes(tipo) ? "corporativo"
  : ["festainfantil", "chadebebe", "baptizado"].includes(tipo) ? "infantil" : "social";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-calc");
  const el = (id) => document.getElementById(id);

  el("c-tipo").innerHTML = TIPOS_EVENTO.map((t) => `<option value="${t.id}">${t.nome}</option>`).join("");
  el("c-provincia").innerHTML = PROVINCIAS.map((p) => `<option>${p}</option>`).join("");

  // Valores vindos da pesquisa da página inicial
  const params = new URLSearchParams(location.search);
  if (params.get("tipo")) form.tipo.value = params.get("tipo");
  if (params.get("convidados")) form.convidados.value = params.get("convidados");
  if (params.get("valor")) {
    form.valor.value = params.get("valor");
    form.querySelector('input[name="modo"][value="distribuir"]').checked = true;
  }

  let ultimo = null;

  function calcular() {
    const d = Object.fromEntries(new FormData(form));
    const modo = d.modo;
    const conv = Math.max(Number(d.convidados) || 0, 1);
    el("bloco-nivel").hidden = modo !== "estimar";
    el("bloco-valor").hidden = modo !== "distribuir";

    const factor = FACTOR_PROVINCIA[d.provincia] ?? FACTOR_OUTRAS;
    const total = modo === "estimar"
      ? Math.round((CUSTO_POR_CONVIDADO[d.nivel] * conv * factor) / 10000) * 10000
      : Number(d.valor) || 0;

    el("r-rotulo").textContent = modo === "estimar" ? "Custo estimado" : "Orçamento disponível";
    el("r-total").textContent = formatarKz(total);
    el("r-pessoa").textContent = formatarKz(total / conv);
    el("r-conv").textContent = conv;

    const dist = DISTRIBUICOES[GRUPO(d.tipo)];
    const max = Math.max(...Object.values(dist));
    el("r-linhas").innerHTML = Object.entries(dist).sort((a, b) => b[1] - a[1]).map(([cat, pct]) => {
      const c = categoriaPorId(cat);
      return `
        <div class="linha-cat">
          <span class="linha-cat__icone">${ICONES[cat]}</span>
          <div>
            <div class="linha-cat__nome">${c.nome}<span>${pct}%</span></div>
            <div class="barra-calc"><i style="width:${(pct / max) * 100}%"></i></div>
          </div>
          <div class="linha-cat__valor">
            <strong>${formatarKz(Math.round((total * pct) / 100 / 1000) * 1000)}</strong>
            <a href="fornecedores.html?categoria=${cat}&provincia=${encodeURIComponent(d.provincia)}">Ver fornecedores</a>
          </div>
        </div>`;
    }).join("");

    el("ver-forn").href = `fornecedores.html?provincia=${encodeURIComponent(d.provincia)}`;
    ultimo = { ...d, total, conv, dist };
  }

  form.addEventListener("input", calcular);
  form.addEventListener("change", calcular);
  form.addEventListener("submit", (e) => e.preventDefault());

  // Enviar para o planeador
  el("guardar-plano").addEventListener("click", () => {
    const chave = "yoha_planeador";
    const estado = JSON.parse(localStorage.getItem(chave) || "null");
    if (estado && estado.evento) {
      if (!confirm("Substituir o orçamento do seu evento actual por esta distribuição?")) return;
      estado.evento.orcamento = ultimo.total;
      estado.despesas = Object.entries(ultimo.dist).map(([categoria, pct]) => ({
        id: Date.now().toString(36) + categoria, categoria, descricao: categoriaPorId(categoria).nome,
        previsto: Math.round((ultimo.total * pct) / 100 / 1000) * 1000, pago: 0
      }));
      localStorage.setItem(chave, JSON.stringify(estado));
      location.href = "planeador.html#orcamento";
    } else {
      const q = new URLSearchParams({ tipo: ultimo.tipo, convidados: ultimo.conv, orcamento: ultimo.total, provincia: ultimo.provincia });
      location.href = `planeador.html?${q}`;
    }
  });

  calcular();
});
