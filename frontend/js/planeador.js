/* ==========================================================================
   YOHA EVENTOS — Planeador
   Todos os dados ficam no navegador (localStorage) com a chave "yoha_planeador".
   Quando existir um backend, basta substituir carregar() e guardar().
   ========================================================================== */

const CHAVE = "yoha_planeador";
const ICONE_X = '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 2l10 10M12 2L2 12"/></svg>';

let estado = carregar();

function carregar() {
  try {
    const e = JSON.parse(localStorage.getItem(CHAVE)) || null;
    if (e && !e.mesas) e.mesas = [];
    return e;
  } catch { return null; }
}
function guardar() {
  localStorage.setItem(CHAVE, JSON.stringify(estado));
  renderTudo();
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const $ = (s) => document.querySelector(s);
const esc = (t = "") => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Datas ---------- */
const hoje = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const paraData = (iso) => { const [a, m, d] = iso.split("-").map(Number); return new Date(a, m - 1, d); };
const paraISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fmtData = (iso, longo) => iso
  ? paraData(iso).toLocaleDateString("pt-PT", longo ? { weekday: "long", day: "numeric", month: "long", year: "numeric" } : { day: "2-digit", month: "short", year: "numeric" })
  : "Sem prazo";
const diasAte = (iso) => Math.round((paraData(iso) - hoje()) / 86400000);

/* ---------- Modelos: checklist e orçamento ---------- */
// [fase, título, dias antes do evento]
const MODELO_TAREFAS = [
  ["12 meses ou mais", "Definir orçamento global", 365],
  ["12 meses ou mais", "Fazer a lista preliminar de convidados", 350],
  ["12 meses ou mais", "Escolher e reservar o espaço", 330],
  ["6 a 12 meses", "Contratar fotógrafo e videógrafo", 270],
  ["6 a 12 meses", "Contratar catering e marcar degustação", 240],
  ["6 a 12 meses", "Contratar decoração e flores", 210],
  ["6 a 12 meses", "Reservar DJ ou banda", 200],
  ["3 a 6 meses", "Encomendar trajes / vestido", 160],
  ["3 a 6 meses", "Enviar save-the-date", 150],
  ["3 a 6 meses", "Encomendar o bolo", 120],
  ["3 a 6 meses", "Reservar transporte", 100],
  ["1 a 3 meses", "Enviar convites", 75],
  ["1 a 3 meses", "Fechar menu e bebidas", 60],
  ["1 a 3 meses", "Prova de maquilhagem e cabelo", 45],
  ["1 a 3 meses", "Confirmar presenças (RSVP)", 30],
  ["Último mês", "Planta de mesas", 21],
  ["Último mês", "Alinhamento do dia com o mestre de cerimónias", 14],
  ["Último mês", "Confirmar horários com todos os fornecedores", 7],
  ["Último mês", "Liquidar pagamentos finais", 3],
  ["Último mês", "Preparar envelopes e kit de emergência", 1]
];
const EXTRA_CASAMENTO = [
  ["6 a 12 meses", "Tratar da documentação na conservatória", 180],
  ["3 a 6 meses", "Preparar o alambamento com as famílias", 120],
  ["1 a 3 meses", "Escolher alianças", 60]
];
const EXTRA_CORPORATIVO = [
  ["6 a 12 meses", "Definir objectivos e público-alvo", 200],
  ["3 a 6 meses", "Confirmar oradores e programa", 100],
  ["1 a 3 meses", "Credenciação e lista de acessos", 30]
];

// percentagem do orçamento por categoria
const MODELO_ORCAMENTO = [
  ["espacos", "Aluguer do espaço", 0.22],
  ["catering", "Catering e bebidas", 0.30],
  ["decoracao", "Decoração e flores", 0.12],
  ["fotografia", "Fotografia e vídeo", 0.10],
  ["musica", "DJ / música", 0.06],
  ["trajes", "Trajes", 0.07],
  ["bolos", "Bolo e doces", 0.04],
  ["convites", "Convites", 0.02],
  ["transporte", "Transporte", 0.03],
  ["beleza", "Beleza", 0.02]
];

function novoEstado(ev) {
  const data = paraData(ev.data);
  const modelo = [...MODELO_TAREFAS];
  if (["casamento", "pedido", "noivado", "bodas"].includes(ev.tipo)) modelo.push(...EXTRA_CASAMENTO);
  if (["corporativo", "conferencia", "lancamento", "gala", "workshop"].includes(ev.tipo)) modelo.push(...EXTRA_CORPORATIVO);

  const diasDisponiveis = Math.max(diasAte(ev.data), 1);
  const tarefas = modelo
    .sort((a, b) => b[2] - a[2])
    .map(([fase, titulo, antes]) => {
      // se o evento é mais cedo do que o modelo prevê, comprime os prazos proporcionalmente
      const ajustado = diasDisponiveis < 365 ? Math.round((antes / 365) * diasDisponiveis) : antes;
      const prazo = new Date(data); prazo.setDate(prazo.getDate() - ajustado);
      return { id: uid(), titulo, fase, prazo: paraISO(prazo), feita: false };
    });

  const total = Number(ev.orcamento) || 0;
  const despesas = MODELO_ORCAMENTO.map(([categoria, descricao, p]) => ({
    id: uid(), categoria, descricao, previsto: Math.round((total * p) / 1000) * 1000, pago: 0
  }));

  return { evento: ev, tarefas, despesas, convidados: [], fornecedores: [], mesas: [], criadoEm: new Date().toISOString() };
}

/* ---------- Ecrãs ---------- */
function mostrarEcra() {
  const temEvento = !!(estado && estado.evento);
  $("#ecra-criar").hidden = temEvento;
  $("#ecra-painel").hidden = !temEvento;
  if (temEvento) { renderTudo(); mudarVista(); }
}

function mudarVista() {
  const vista = (location.hash || "#geral").slice(1);
  const valida = ["geral", "checklist", "orcamento", "convidados", "mesas", "fornecedores"].includes(vista) ? vista : "geral";
  document.querySelectorAll(".vista").forEach((v) => v.classList.toggle("activa", v.id === "vista-" + valida));
  document.querySelectorAll(".painel__tabs a").forEach((a) => a.classList.toggle("activo", a.dataset.vista === valida));
}

/* ---------- Render ---------- */
function renderTudo() {
  if (!estado || !estado.evento) return;
  renderMenu(); renderGeral(); renderChecklist(); renderOrcamento(); renderConvidados(); renderMesas(); renderFornecedores();
}

function totais() {
  const previsto = estado.despesas.reduce((s, d) => s + Number(d.previsto || 0), 0);
  const pagoDesp = estado.despesas.reduce((s, d) => s + Number(d.pago || 0), 0);
  const pagoForn = estado.fornecedores.reduce((s, f) => s + Number(f.pago || 0), 0);
  return { previsto, pago: pagoDesp + pagoForn, total: Number(estado.evento.orcamento) || 0 };
}

function renderMenu() {
  const ev = estado.evento;
  const tipo = TIPOS_EVENTO.find((t) => t.id === ev.tipo);
  $("#m-tipo").textContent = tipo ? tipo.nome : "Evento";
  $("#m-nome").textContent = ev.nome;
  $("#m-data").textContent = `${fmtData(ev.data)} · ${ev.provincia}`;
  const pend = estado.tarefas.filter((t) => !t.feita).length;
  $("#c-tarefas").textContent = pend ? pend : "";
  $("#c-convidados").textContent = estado.convidados.length || "";
  $("#c-fornecedores").textContent = estado.fornecedores.length || "";
  $("#c-mesas").textContent = estado.mesas.length || "";
}

function renderGeral() {
  const ev = estado.evento;
  const d = diasAte(ev.data);
  $("#g-dias").textContent = Math.abs(d);
  $("#g-dias-rotulo").textContent = d > 0 ? (d === 1 ? "dia para o grande dia" : "dias para o grande dia") : d === 0 ? "É hoje!" : "dias desde o evento";
  $("#g-nome").textContent = ev.nome;
  $("#g-detalhes").textContent = `${fmtData(ev.data, true)} · ${ev.local || "Local a definir"}, ${ev.provincia} · ${ev.convidados} convidados previstos`;

  const feitas = estado.tarefas.filter((t) => t.feita).length;
  const pctT = estado.tarefas.length ? Math.round((feitas / estado.tarefas.length) * 100) : 0;
  $("#g-tarefas").textContent = `${feitas} / ${estado.tarefas.length}`;
  $("#g-tarefas-barra").style.width = pctT + "%";

  const { pago, total } = totais();
  const pctO = total ? Math.round((pago / total) * 100) : 0;
  $("#g-orc").textContent = pctO + "%";
  $("#g-orc-sub").textContent = `${formatarKz(pago)} de ${formatarKz(total)}`;
  $("#g-orc-barra").style.width = Math.min(pctO, 100) + "%";
  $("#g-orc-barra-wrap").classList.toggle("barra--alerta", pctO > 100);

  const conf = estado.convidados.filter((c) => c.rsvp === "confirmado");
  const pessoas = conf.reduce((s, c) => s + 1 + Number(c.acompanhantes || 0), 0);
  $("#g-conv").textContent = pessoas;
  $("#g-conv-sub").textContent = `de ${ev.convidados} previstos`;

  const fechados = estado.fornecedores.filter((f) => f.estado === "contratado" || f.estado === "pago").length;
  $("#g-forn").textContent = fechados;
  $("#g-forn-sub").textContent = `${estado.fornecedores.length} no total`;

  const proximas = estado.tarefas.filter((t) => !t.feita).sort((a, b) => (a.prazo || "9").localeCompare(b.prazo || "9")).slice(0, 5);
  $("#g-proximas").innerHTML = proximas.length
    ? proximas.map((t) => {
        const atr = t.prazo && diasAte(t.prazo) < 0;
        return `<li><span>${esc(t.titulo)}</span><span class="muted" style="${atr ? "color: var(--alerta)" : ""}">${atr ? "Atrasada" : fmtData(t.prazo)}</span></li>`;
      }).join("")
    : `<li><span class="muted">Todas as tarefas estão concluídas.</span></li>`;

  const pend = estado.fornecedores.filter((f) => Number(f.valor) > Number(f.pago));
  $("#g-pagamentos").innerHTML = pend.length
    ? pend.map((f) => `<li><span>${esc(f.nome)}</span><strong style="color: var(--bordo-800); font-weight: 500">${formatarKz(f.valor - f.pago)}</strong></li>`).join("")
    : `<li><span class="muted">Sem pagamentos pendentes a fornecedores.</span></li>`;
}

let filtroChk = "todas";
function renderChecklist() {
  const fases = [...new Set(estado.tarefas.map((t) => t.fase || "Outras tarefas"))];
  const visivel = (t) => filtroChk === "todas" || (filtroChk === "feitas" ? t.feita : !t.feita);
  const html = fases.map((fase) => {
    const doGrupo = estado.tarefas.filter((t) => (t.fase || "Outras tarefas") === fase);
    const lista = doGrupo.filter(visivel).sort((a, b) => (a.prazo || "9").localeCompare(b.prazo || "9"));
    if (!lista.length) return "";
    const feitas = doGrupo.filter((t) => t.feita).length;
    return `
      <div class="fase">
        <div class="fase__titulo"><h3>${esc(fase)}</h3><span>${feitas} de ${doGrupo.length}</span></div>
        ${lista.map((t) => {
          const atr = !t.feita && t.prazo && diasAte(t.prazo) < 0;
          return `
          <div class="tarefa ${t.feita ? "feita" : ""}">
            <input class="caixa" type="checkbox" data-tarefa="${t.id}" ${t.feita ? "checked" : ""} aria-label="Concluir tarefa">
            <span class="tarefa__titulo">${esc(t.titulo)}</span>
            <span class="tarefa__prazo ${atr ? "atrasada" : ""}">${atr ? "Atrasada · " : ""}${fmtData(t.prazo)}</span>
            <button class="remover" data-remover-tarefa="${t.id}" aria-label="Remover">${ICONE_X}</button>
          </div>`;
        }).join("")}
      </div>`;
  }).join("");
  $("#chk-lista").innerHTML = html || `<div class="vazio-painel"><h3>Nada por aqui</h3><p>Não há tarefas neste filtro.</p></div>`;
}

function renderOrcamento() {
  const { previsto, pago, total } = totais();
  $("#orc-total").value = total;
  $("#o-total").textContent = formatarKz(total);
  $("#o-previsto").textContent = formatarKz(previsto);
  $("#o-previsto-barra").style.width = Math.min(total ? (previsto / total) * 100 : 0, 100) + "%";
  $("#o-pago").textContent = formatarKz(pago);
  $("#o-saldo").textContent = formatarKz(total - previsto);
  $("#o-saldo").style.color = total - previsto < 0 ? "var(--alerta)" : "";

  const opcoesCat = (sel) => CATEGORIAS.map((c) => `<option value="${c.id}" ${c.id === sel ? "selected" : ""}>${c.nome}</option>`).join("") + `<option value="outros" ${sel === "outros" ? "selected" : ""}>Outros</option>`;

  $("#orc-linhas").innerHTML = estado.despesas.map((d) => `
    <tr>
      <td><select class="mini" data-desp="${d.id}" data-campo="categoria">${opcoesCat(d.categoria)}</select></td>
      <td><input class="mini" data-desp="${d.id}" data-campo="descricao" value="${esc(d.descricao)}"></td>
      <td class="num"><input class="mini num" type="number" min="0" step="1000" data-desp="${d.id}" data-campo="previsto" value="${d.previsto}"></td>
      <td class="num"><input class="mini num" type="number" min="0" step="1000" data-desp="${d.id}" data-campo="pago" value="${d.pago}"></td>
      <td class="num">${formatarKz(Math.max(d.previsto - d.pago, 0))}</td>
      <td><button class="remover" data-remover-desp="${d.id}" aria-label="Remover">${ICONE_X}</button></td>
    </tr>`).join("") || `<tr><td colspan="6" class="muted" style="text-align:center; padding: 32px">Sem despesas registadas.</td></tr>`;

  const pagoDesp = estado.despesas.reduce((s, d) => s + Number(d.pago || 0), 0);
  $("#orc-t-prev").textContent = formatarKz(previsto);
  $("#orc-t-pago").textContent = formatarKz(pagoDesp);
  $("#orc-t-falta").textContent = formatarKz(Math.max(previsto - pagoDesp, 0));
}

function renderConvidados() {
  const termo = ($("#conv-pesquisa").value || "").toLowerCase();
  const c = estado.convidados;
  const soma = (f) => c.filter(f).reduce((s, x) => s + 1 + Number(x.acompanhantes || 0), 0);
  $("#cv-total").textContent = soma(() => true);
  $("#cv-conf").textContent = soma((x) => x.rsvp === "confirmado");
  $("#cv-pend").textContent = soma((x) => x.rsvp === "pendente");
  $("#cv-nao").textContent = soma((x) => x.rsvp === "recusado");

  const lista = c.filter((x) => !termo || x.nome.toLowerCase().includes(termo));
  $("#conv-linhas").innerHTML = lista.map((x) => `
    <tr>
      <td><input class="mini" data-conv="${x.id}" data-campo="nome" value="${esc(x.nome)}"></td>
      <td><input class="mini" data-conv="${x.id}" data-campo="telefone" value="${esc(x.telefone)}"></td>
      <td><select class="mini" data-conv="${x.id}" data-campo="grupo">${["Família", "Amigos", "Trabalho", "Outros"].map((g) => `<option ${g === x.grupo ? "selected" : ""}>${g}</option>`).join("")}</select></td>
      <td><input class="mini" style="min-width: 60px" type="number" min="0" data-conv="${x.id}" data-campo="acompanhantes" value="${x.acompanhantes || 0}"></td>
      <td><select class="mini" data-conv="${x.id}" data-campo="rsvp">
        <option value="pendente" ${x.rsvp === "pendente" ? "selected" : ""}>Pendente</option>
        <option value="confirmado" ${x.rsvp === "confirmado" ? "selected" : ""}>Confirmado</option>
        <option value="recusado" ${x.rsvp === "recusado" ? "selected" : ""}>Não vem</option>
      </select></td>
      <td><select class="mini" style="min-width: 120px" data-conv="${x.id}" data-campo="mesa"><option value="">Sem mesa</option>${estado.mesas.map((m) => `<option ${m.nome === x.mesa ? "selected" : ""}>${esc(m.nome)}</option>`).join("")}</select></td>
      <td><input class="mini" data-conv="${x.id}" data-campo="restricao" value="${esc(x.restricao)}" placeholder="Nenhuma"></td>
      <td><button class="remover" data-remover-conv="${x.id}" aria-label="Remover">${ICONE_X}</button></td>
    </tr>`).join("") || `<tr><td colspan="8" class="muted" style="text-align:center; padding: 32px">${termo ? "Nenhum convidado encontrado." : "Adicione o primeiro convidado acima."}</td></tr>`;
}

function renderMesas() {
  const pessoas = (c) => 1 + Number(c.acompanhantes || 0);
  const ativos = estado.convidados.filter((c) => c.rsvp !== "recusado");
  const lugares = estado.mesas.reduce((s, m) => s + Number(m.lugares || 0), 0);
  const sentados = ativos.filter((c) => c.mesa).reduce((s, c) => s + pessoas(c), 0);
  $("#mesas-resumo").textContent = `${estado.mesas.length} mesas · ${lugares} lugares · ${sentados} pessoas sentadas`;

  $("#grelha-mesas").innerHTML = estado.mesas.map((m) => {
    const lista = ativos.filter((c) => c.mesa === m.nome);
    const ocup = lista.reduce((s, c) => s + pessoas(c), 0);
    const classe = ocup > m.lugares ? "excesso" : ocup === Number(m.lugares) ? "cheia" : "";
    return `
      <div class="mesa">
        <div class="mesa__topo">
          <h4>${esc(m.nome)}</h4>
          <div style="display:flex; align-items:center; gap:4px">
            <span class="mesa__ocupacao ${classe}">${ocup}/${m.lugares}</span>
            <button class="remover" data-remover-mesa="${m.id}" aria-label="Remover mesa">${ICONE_X}</button>
          </div>
        </div>
        <ul>${lista.map((c) => `<li><span>${esc(c.nome)}${c.acompanhantes ? ` <span class="muted">+${c.acompanhantes}</span>` : ""}</span><button type="button" data-tirar="${c.id}">Retirar</button></li>`).join("") || '<li class="muted" style="border:0">Mesa vazia</li>'}</ul>
      </div>`;
  }).join("") || `<div class="vazio-painel" style="grid-column: 1 / -1"><h3>Ainda sem mesas</h3><p>Adicione mesas acima ou crie-as automaticamente.</p></div>`;

  const sem = ativos.filter((c) => !c.mesa);
  $("#sem-mesa-n").textContent = sem.length ? `${sem.length} convidados` : "";
  const opcoes = estado.mesas.map((m) => `<option>${esc(m.nome)}</option>`).join("");
  $("#sem-mesa").innerHTML = sem.map((c) => `
    <li><span>${esc(c.nome)}${c.acompanhantes ? ` <span class="muted">+${c.acompanhantes}</span>` : ""}</span>
      ${estado.mesas.length ? `<select class="entrada" data-sentar="${c.id}"><option value="">Mesa…</option>${opcoes}</select>` : ""}</li>`).join("")
    || `<li class="muted">${estado.convidados.length ? "Todos os convidados têm mesa." : "Adicione convidados na secção Convidados."}</li>`;
}

function renderFornecedores() {
  const ESTADOS = { negociacao: "Em negociação", contratado: "Contratado", pago: "Pago" };
  $("#forn-linhas").innerHTML = estado.fornecedores.map((f) => {
    const cat = categoriaPorId(f.categoria);
    const nome = f.ref ? `<a href="fornecedor.html?id=${f.ref}" style="border-bottom: 1px solid var(--linha)">${esc(f.nome)}</a>` : esc(f.nome);
    return `
    <tr>
      <td>${nome}</td>
      <td>${cat ? cat.nome : "Outros"}</td>
      <td>${esc(f.contacto) || '<span class="muted">—</span>'}</td>
      <td><select class="mini" data-forn="${f.id}" data-campo="estado">${Object.entries(ESTADOS).map(([k, v]) => `<option value="${k}" ${k === f.estado ? "selected" : ""}>${v}</option>`).join("")}</select></td>
      <td class="num"><input class="mini num" type="number" min="0" step="1000" data-forn="${f.id}" data-campo="valor" value="${f.valor || 0}"></td>
      <td class="num"><input class="mini num" type="number" min="0" step="1000" data-forn="${f.id}" data-campo="pago" value="${f.pago || 0}"></td>
      <td><button class="remover" data-remover-forn="${f.id}" aria-label="Remover">${ICONE_X}</button></td>
    </tr>`;
  }).join("") || `<tr><td colspan="7" class="muted" style="text-align:center; padding: 32px">Ainda não adicionou fornecedores. Pode adicioná-los aqui ou a partir do <a href="fornecedores.html" style="color: var(--bordo-800); border-bottom: 1px solid">diretório</a>.</td></tr>`;
}

/* ---------- Eventos ---------- */
function ligar() {
  // Opções dos selects
  $("#ev-tipo").innerHTML = TIPOS_EVENTO.map((t) => `<option value="${t.id}">${t.nome}</option>`).join("");
  $("#ev-provincia").innerHTML = PROVINCIAS.map((p) => `<option>${p}</option>`).join("");
  const opts = CATEGORIAS.map((c) => `<option value="${c.id}">${c.nome}</option>`).join("") + `<option value="outros">Outros</option>`;
  $("#desp-cat").innerHTML = opts;
  $("#forn-cat").innerHTML = opts;

  const qs = new URLSearchParams(location.search);
  if (qs.get("tipo")) $("#ev-tipo").value = qs.get("tipo");
  if (qs.get("provincia")) $("#ev-provincia").value = qs.get("provincia");
  if (qs.get("convidados")) $('#form-evento [name="convidados"]').value = qs.get("convidados");
  if (qs.get("orcamento")) $('#form-evento [name="orcamento"]').value = qs.get("orcamento");
  const daqui = new Date(); daqui.setMonth(daqui.getMonth() + 8);
  $('#form-evento [name="data"]').value = paraISO(daqui);

  // Criar / editar evento
  let editar = false;
  $("#form-evento").addEventListener("submit", (e) => {
    e.preventDefault();
    const ev = Object.fromEntries(new FormData(e.target));
    if (!ev.nome.trim() || !ev.data) { mostrarAviso("Indique o nome e a data do evento."); return; }
    ev.convidados = Number(ev.convidados) || 0;
    ev.orcamento = Number(ev.orcamento) || 0;
    if (editar && estado) {
      estado.evento = ev;
      editar = false;
      mostrarAviso("Detalhes do evento actualizados.");
    } else {
      estado = novoEstado(ev);
      location.hash = "#geral";
      mostrarAviso("O seu painel está pronto.");
    }
    guardar();
    mostrarEcra();
    window.scrollTo(0, 0);
  });

  $("#editar-evento").addEventListener("click", () => {
    editar = true;
    const f = $("#form-evento");
    Object.entries(estado.evento).forEach(([k, v]) => { if (f.elements[k]) f.elements[k].value = v; });
    $("#criar-etiqueta").textContent = "Editar evento";
    $("#criar-titulo").textContent = "Actualizar detalhes";
    $("#cancelar-edicao").hidden = false;
    $("#ecra-criar").hidden = false;
    $("#ecra-painel").hidden = true;
    window.scrollTo(0, 0);
  });
  $("#cancelar-edicao").addEventListener("click", () => { editar = false; mostrarEcra(); });

  $("#apagar-evento").addEventListener("click", () => {
    if (!confirm("Apagar este evento e todos os dados associados? Esta acção não pode ser desfeita.")) return;
    localStorage.removeItem(CHAVE);
    estado = null;
    $("#form-evento").reset();
    $("#criar-etiqueta").textContent = "Novo evento";
    $("#criar-titulo").textContent = "Detalhes do evento";
    $("#cancelar-edicao").hidden = true;
    mostrarEcra();
  });

  $("#exportar").addEventListener("click", () => {
    descarregar(`yoha-${estado.evento.nome.replace(/\W+/g, "-").toLowerCase()}.json`, JSON.stringify(estado, null, 2), "application/json");
  });

  window.addEventListener("hashchange", mudarVista);

  // Checklist
  $("#form-tarefa").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    estado.tarefas.push({ id: uid(), titulo: d.titulo.trim(), prazo: d.prazo || "", fase: "Tarefas pessoais", feita: false });
    e.target.reset(); guardar();
  });
  $("#chk-filtros").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    filtroChk = b.dataset.f;
    document.querySelectorAll("#chk-filtros .chip").forEach((c) => c.classList.toggle("activo", c === b));
    renderChecklist();
  });
  $("#chk-lista").addEventListener("change", (e) => {
    const id = e.target.dataset.tarefa; if (!id) return;
    estado.tarefas.find((t) => t.id === id).feita = e.target.checked; guardar();
  });

  // Orçamento
  $("#orc-total").addEventListener("change", (e) => { estado.evento.orcamento = Number(e.target.value) || 0; guardar(); });
  $("#form-despesa").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    estado.despesas.push({ id: uid(), categoria: d.categoria, descricao: d.descricao.trim(), previsto: Number(d.previsto) || 0, pago: 0 });
    e.target.reset(); guardar();
  });

  // Convidados
  $("#form-convidado").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    estado.convidados.push({ id: uid(), nome: d.nome.trim(), telefone: d.telefone, grupo: d.grupo, acompanhantes: Number(d.acompanhantes) || 0, rsvp: "pendente", mesa: "", restricao: "" });
    e.target.reset(); e.target.elements.nome.focus(); guardar();
  });
  $("#conv-pesquisa").addEventListener("input", renderConvidados);
  $("#conv-csv").addEventListener("click", () => {
    const linhas = [["Nome", "Telefone", "Grupo", "Acompanhantes", "Presença", "Mesa", "Restrições"]]
      .concat(estado.convidados.map((c) => [c.nome, c.telefone, c.grupo, c.acompanhantes, c.rsvp, c.mesa, c.restricao]));
    const csv = linhas.map((l) => l.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
    descarregar("convidados.csv", "﻿" + csv, "text/csv");
  });

  // Mesas
  $("#form-mesa").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const nome = d.nome.trim();
    if (estado.mesas.some((m) => m.nome.toLowerCase() === nome.toLowerCase())) { mostrarAviso("Já existe uma mesa com esse nome."); return; }
    estado.mesas.push({ id: uid(), nome, lugares: Number(d.lugares) || 10 });
    e.target.reset(); e.target.elements.lugares.value = 10; guardar();
  });
  $("#mesas-auto").addEventListener("click", () => {
    const lugares = Number($('#form-mesa [name="lugares"]').value) || 10;
    const total = Math.max(estado.convidados.filter((c) => c.rsvp !== "recusado").reduce((s, c) => s + 1 + Number(c.acompanhantes || 0), 0), Number(estado.evento.convidados) || 0);
    const precisas = Math.ceil(total / lugares) - estado.mesas.length;
    if (precisas <= 0) { mostrarAviso("Já tem mesas suficientes para os convidados."); return; }
    let n = estado.mesas.length;
    for (let i = 0; i < precisas; i++) {
      n++; while (estado.mesas.some((m) => m.nome === `Mesa ${n}`)) n++;
      estado.mesas.push({ id: uid(), nome: `Mesa ${n}`, lugares });
    }
    mostrarAviso(`${precisas} mesas criadas.`);
    guardar();
  });
  $("#vista-mesas").addEventListener("change", (e) => {
    const id = e.target.dataset.sentar; if (!id || !e.target.value) return;
    estado.convidados.find((c) => c.id === id).mesa = e.target.value; guardar();
  });
  $("#vista-mesas").addEventListener("click", (e) => {
    const t = e.target.closest("[data-tirar]");
    if (t) { estado.convidados.find((c) => c.id === t.dataset.tirar).mesa = ""; guardar(); }
  });

  // Fornecedores
  $("#form-fornecedor").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    estado.fornecedores.push({ id: uid(), nome: d.nome.trim(), categoria: d.categoria, contacto: d.contacto, valor: Number(d.valor) || 0, pago: 0, estado: "negociacao" });
    e.target.reset(); guardar();
  });

  // Edição inline e remoção (delegação de eventos)
  const colecoes = { desp: "despesas", conv: "convidados", forn: "fornecedores" };
  document.querySelector(".painel__conteudo").addEventListener("change", (e) => {
    for (const [k, col] of Object.entries(colecoes)) {
      const id = e.target.dataset[k];
      if (id) {
        const item = estado[col].find((x) => x.id === id);
        const campo = e.target.dataset.campo;
        item[campo] = e.target.type === "number" ? Number(e.target.value) || 0 : e.target.value;
        if (col === "fornecedores" && campo === "estado" && item.estado === "pago") item.pago = item.valor;
        guardar();
      }
    }
  });
  document.querySelector(".painel__conteudo").addEventListener("click", (e) => {
    const b = e.target.closest(".remover"); if (!b) return;
    if (b.dataset.removerMesa) {
      const m = estado.mesas.find((x) => x.id === b.dataset.removerMesa);
      estado.convidados.forEach((c) => { if (c.mesa === m.nome) c.mesa = ""; });
    }
    const mapa = { removerTarefa: "tarefas", removerDesp: "despesas", removerConv: "convidados", removerForn: "fornecedores", removerMesa: "mesas" };
    for (const [k, col] of Object.entries(mapa)) {
      if (b.dataset[k]) { estado[col] = estado[col].filter((x) => x.id !== b.dataset[k]); guardar(); }
    }
  });
}

function descarregar(nome, conteudo, tipo) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
  const a = Object.assign(document.createElement("a"), { href: url, download: nome });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  ligar();
  mostrarEcra();
});
