/* Diretório de fornecedores — filtros, ordenação e URL partilhável */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const el = (id) => document.getElementById(id);

  // Categorias (caixas de selecção com contagem)
  el("f-categorias").innerHTML = CATEGORIAS.map((c) => {
    const n = FORNECEDORES.filter((f) => f.categoria === c.id).length;
    return `<label class="opcao"><input class="caixa" type="checkbox" name="cat" value="${c.id}"> ${c.nome}<span class="conta">${n}</span></label>`;
  }).join("");

  el("f-provincia").innerHTML += PROVINCIAS.map((p) => `<option>${p}</option>`).join("");

  // Estado inicial a partir do URL (ex.: vindo da pesquisa da página inicial)
  const catInicial = params.get("categoria");
  if (catInicial) {
    const cx = document.querySelector(`input[name="cat"][value="${catInicial}"]`);
    if (cx) cx.checked = true;
  }
  if (params.get("provincia")) el("f-provincia").value = params.get("provincia");
  if (params.get("q")) el("f-texto").value = params.get("q");
  if (params.get("convidados")) el("f-convidados").value = params.get("convidados");

  function filtrar() {
    const texto = el("f-texto").value.trim().toLowerCase();
    const cats = [...document.querySelectorAll('input[name="cat"]:checked')].map((i) => i.value);
    const prov = el("f-provincia").value;
    const preco = Number(el("f-preco").value) || Infinity;
    const verif = el("f-verificado").checked;
    const conv = Number(el("f-convidados").value) || 0;

    let lista = FORNECEDORES.filter((f) => {
      if (cats.length && !cats.includes(f.categoria)) return false;
      if (prov && f.provincia !== prov) return false;
      if (f.precoDesde > preco) return false;
      if (verif && !f.verificado) return false;
      if (conv && f.capacidade && (conv > f.capacidade[1])) return false;
      if (conv && !f.capacidade && f.categoria === "espacos") return false;
      if (texto) {
        const alvo = `${f.nome} ${f.resumo} ${f.local} ${categoriaPorId(f.categoria).nome}`.toLowerCase();
        if (!alvo.includes(texto)) return false;
      }
      return true;
    });

    const ord = el("ordenar").value;
    const fns = {
      destaque: (a, b) => (b.destaque - a.destaque) || (b.verificado - a.verificado),
      "preco-asc": (a, b) => a.precoDesde - b.precoDesde,
      "preco-desc": (a, b) => b.precoDesde - a.precoDesde,
      nome: (a, b) => a.nome.localeCompare(b.nome, "pt")
    };
    lista.sort(fns[ord]);

    el("total").textContent = lista.length;
    el("resultados").innerHTML = lista.length
      ? lista.map(cartaoFornecedor).join("")
      : `<div class="vazio" style="grid-column: 1 / -1">
           <h3>Sem resultados</h3>
           <p class="muted">Experimente alargar a pesquisa ou limpar os filtros.</p>
         </div>`;

    // Título contextual
    el("titulo-pagina").innerHTML = cats.length === 1
      ? `${categoriaPorId(cats[0]).nome}${prov ? " em " + prov : ""}`
      : `Fornecedores${prov ? " em " + prov : ""}`;

    // Actualizar URL sem recarregar
    const q = new URLSearchParams();
    if (cats.length === 1) q.set("categoria", cats[0]);
    if (prov) q.set("provincia", prov);
    if (texto) q.set("q", texto);
    if (conv) q.set("convidados", conv);
    history.replaceState(null, "", q.toString() ? `?${q}` : location.pathname);

    document.querySelectorAll("#resultados .revelar").forEach((c) => c.classList.add("visivel"));
  }

  document.querySelectorAll("#filtros input, #filtros select, #ordenar").forEach((i) =>
    i.addEventListener(["search", "number"].includes(i.type) ? "input" : "change", filtrar)
  );

  el("f-limpar").addEventListener("click", () => {
    document.querySelectorAll('#filtros input[type="checkbox"]').forEach((c) => (c.checked = false));
    el("f-texto").value = "";
    el("f-provincia").value = "";
    el("f-preco").value = "";
    el("f-convidados").value = "";
    filtrar();
  });

  // Painel de filtros no telemóvel
  const painel = el("filtros");
  document.querySelector("[data-abrir-filtros]").addEventListener("click", () => painel.classList.add("aberto"));
  document.querySelector("[data-fechar-filtros]").addEventListener("click", () => painel.classList.remove("aberto"));

  filtrar();
});
