/* Página de perfil do fornecedor */

document.addEventListener("DOMContentLoaded", () => {
  const raiz = document.getElementById("perfil-raiz");
  const id = new URLSearchParams(location.search).get("id");
  const f = fornecedorPorId(id) || FORNECEDORES[0];
  const cat = categoriaPorId(f.categoria);

  document.title = `${f.nome} — Yoha Eventos`;

  const relacionados = FORNECEDORES
    .filter((o) => o.id !== f.id && (o.categoria === f.categoria || o.provincia === f.provincia))
    .slice(0, 3);

  const tiposOpcoes = TIPOS_EVENTO.map((t) => `<option value="${t.id}">${t.nome}</option>`).join("");

  raiz.innerHTML = `
    <nav class="migalhas" aria-label="Navegação estrutural" style="margin: 24px 0 0">
      <a href="index.html">Início</a><span>/</span>
      <a href="fornecedores.html">Fornecedores</a><span>/</span>
      <a href="fornecedores.html?categoria=${cat.id}">${cat.nome}</a><span>/</span>
      <span>${f.nome}</span>
    </nav>

    <div class="perfil-galeria">
      ${f.galeria.map((src) => `<img src="${src}" alt="${f.nome}" loading="lazy">`).join("")}
    </div>

    <div class="perfil">
      <div class="perfil__info">
        <div class="etiquetas">
          <span class="etiqueta-suave">${cat.nome}</span>
          <span class="etiqueta-suave">${ICONES.local} ${f.local}, ${f.provincia}</span>
          ${f.verificado ? `<span class="etiqueta-suave etiqueta-suave--ok">${ICONES.verificado} Verificado</span>` : ""}
        </div>
        <h1>${f.nome}</h1>
        <p class="lead" style="margin-top:0">${f.resumo}</p>

        <div class="perfil__dados">
          <div><span>Preço desde</span><strong>${formatarKz(f.precoDesde)}</strong></div>
          <div><span>Unidade</span><strong>${f.unidade}</strong></div>
          <div><span>${f.capacidade ? "Capacidade" : "Província"}</span><strong>${f.capacidade ? `${f.capacidade[0]}–${f.capacidade[1]} pessoas` : f.provincia}</strong></div>
        </div>

        <h2>Sobre</h2>
        <p>${f.descricao}</p>

        <h2>Serviços e preços</h2>
        <ul class="servicos">
          ${f.servicos.map(([s, p]) => `<li><span>${s}</span><span>${p}</span></li>`).join("")}
        </ul>
        <p class="muted small" style="margin-top: 12px">Preços indicativos. O valor final depende da data, do local e dos detalhes do evento.</p>
      </div>

      <aside class="pedido" aria-label="Pedir orçamento">
        <h3>Pedir orçamento</h3>
        <p class="pedido__preco">Desde <strong>${formatarKz(f.precoDesde)}</strong> ${f.unidade}</p>
        <a class="btn btn--whatsapp btn--block" target="_blank" rel="noopener" href="${linkWhatsapp(f)}">${ICONES.whatsapp} Falar por WhatsApp</a>
        <p class="pedido__ou">ou envie um pedido</p>
        <form id="form-pedido" novalidate>
          <label class="campo"><span>Nome</span><input class="entrada" name="nome" required autocomplete="name"></label>
          <label class="campo"><span>Telefone</span><input class="entrada" name="telefone" type="tel" required autocomplete="tel" placeholder="+244"></label>
          <div class="linha2">
            <label class="campo"><span>Data</span><input class="entrada" name="data" type="date"></label>
            <label class="campo"><span>Convidados</span><input class="entrada" name="convidados" type="number" min="1"></label>
          </div>
          <label class="campo"><span>Tipo de evento</span><select class="entrada" name="tipo">${tiposOpcoes}</select></label>
          <label class="campo"><span>Mensagem</span><textarea class="entrada" name="mensagem" placeholder="Conte-nos um pouco sobre o seu evento"></textarea></label>
          <button class="btn btn--block" type="submit">Enviar pedido</button>
        </form>
        <button class="btn btn--linha btn--block" style="margin-top: 10px" type="button" id="guardar">Adicionar ao meu evento</button>
      </aside>
    </div>

    ${relacionados.length ? `
    <section style="padding-bottom: 96px">
      <div class="seccao__topo"><div><h2 class="h2" style="font-size:1.6rem">Fornecedores semelhantes</h2></div></div>
      <div class="grelha-fornecedores">${relacionados.map(cartaoFornecedor).join("")}</div>
    </section>` : ""}
  `;

  // Envio do pedido (guardado localmente até existir backend)
  document.getElementById("form-pedido").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const dados = Object.fromEntries(new FormData(form));
    if (!dados.nome.trim() || !dados.telefone.trim()) {
      mostrarAviso("Indique o seu nome e telefone para enviar o pedido.");
      return;
    }
    const pedidos = JSON.parse(localStorage.getItem("yoha_pedidos") || "[]");
    pedidos.push({ ...dados, fornecedor: f.id, criadoEm: new Date().toISOString() });
    localStorage.setItem("yoha_pedidos", JSON.stringify(pedidos));
    form.reset();
    mostrarAviso(`Pedido enviado a ${f.nome}. Entraremos em contacto em breve.`);
  });

  // Adicionar ao planeador
  document.getElementById("guardar").addEventListener("click", () => {
    if (!utilizador()) {
      location.href = "entrar.html?voltar=" + encodeURIComponent("fornecedor.html?id=" + f.id);
      return;
    }
    const chave = "yoha_planeador";
    const estado = JSON.parse(localStorage.getItem(chave) || "null");
    if (!estado || !estado.evento) {
      mostrarAviso("Crie primeiro o seu evento no planeador.");
      setTimeout(() => (location.href = "planeador.html"), 1400);
      return;
    }
    if (estado.fornecedores.some((x) => x.ref === f.id)) {
      mostrarAviso("Este fornecedor já está no seu evento.");
      return;
    }
    estado.fornecedores.push({
      id: Date.now().toString(36), ref: f.id, nome: f.nome, categoria: f.categoria,
      contacto: "+" + f.whatsapp, valor: f.precoDesde, pago: 0, estado: "negociacao"
    });
    localStorage.setItem(chave, JSON.stringify(estado));
    mostrarAviso(`${f.nome} foi adicionado ao seu evento.`);
  });

  activarRevelar();
});
