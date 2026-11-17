/* ==========================================================================
   YOHA EVENTOS — partes comuns a todas as páginas
   (cabeçalho, rodapé, menu móvel, cartões de fornecedor, avisos)
   ========================================================================== */

const SETA = ICONES.seta;

/* ---------- Sessão (só interface: as contas reais precisam de servidor) ---------- */
function utilizador() {
  try { return JSON.parse(localStorage.getItem("yoha_utilizador")) || null; } catch { return null; }
}
function terminarSessao() {
  localStorage.removeItem("yoha_utilizador");
  location.href = "index.html";
}
/* Usado no <head> das páginas privadas: sem sessão, vai para o login */
function exigirSessao() {
  if (!utilizador()) {
    const voltar = location.pathname.split("/").pop() + location.search + location.hash;
    location.replace("entrar.html?voltar=" + encodeURIComponent(voltar));
  }
}

function cabecalhoHTML() {
  const u = utilizador();
  const logo = `
      <a class="marca" href="${u ? "planeador.html" : "index.html"}" aria-label="Yoha Eventos">
        <img src="assets/img/monograma-dourado.png" alt="">
        <span class="marca__nome">YOHA<b>EVENTOS</b></span>
      </a>`;

  const links = u
    ? `<a href="planeador.html">O meu evento</a>
       <a href="fornecedores.html">Fornecedores</a>
       <a href="calculadora.html">Calculadora</a>`
    : `<a href="fornecedores.html">Fornecedores</a>
       <a href="index.html#como-funciona">Como funciona</a>
       <a href="para-fornecedores.html">Para fornecedores</a>`;

  const iniciais = u ? u.nome.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "";
  const iconeConvidado = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10" cy="8" r="4"/><path d="M3 20a7 7 0 0 1 11.5-5.4"/><path d="M17 16l4 4M21 16l-4 4"/></svg>`;

  const painelConta = u
    ? `<div class="conta__topo">
         <span class="conta__avatar">${iniciais}</span>
         <div><strong>${u.nome}</strong><span>${u.email}</span></div>
       </div>
       <nav class="conta__links">
         <a href="planeador.html">O meu evento</a>
         <a href="planeador.html#convidados">Convidados</a>
         <a href="calculadora.html">Calculadora de orçamento</a>
       </nav>
       <button class="btn btn--linha btn--block" type="button" data-sair>Terminar sessão</button>`
    : `<h2 id="conta-titulo">Bem-vindo!</h2>
       <p>Inicie sessão ou crie uma conta para organizar o seu evento e falar com fornecedores.</p>
       <div class="conta__botoes">
         <a class="btn" href="entrar.html">Iniciar sessão</a>
         <a class="btn btn--contorno" href="entrar.html#criar">Criar conta</a>
       </div>`;

  const acoes = `
      <div class="conta">
        <button class="conta__botao ${u ? "conta__botao--sessao" : ""}" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="conta-painel" aria-label="${u ? "A minha conta" : "Iniciar sessão ou criar conta"}">
          ${u ? iniciais : iconeConvidado}
        </button>
        <div class="conta__painel" id="conta-painel" role="dialog" aria-labelledby="conta-titulo">
          ${painelConta}
        </div>
      </div>`;

  return `
  <header class="header">
    <div class="container">
      ${logo}
      <nav class="nav" id="nav" aria-label="Principal">
        ${links}
      </nav>
      <div class="header__acoes">
        ${acoes}
        <button class="menu-toggle" aria-label="Abrir menu" aria-controls="nav" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>`;
}

function rodapeHTML() {
  const ano = new Date().getFullYear();
  const cats = CATEGORIAS.slice(0, 6).map((c) => `<li><a href="fornecedores.html?categoria=${c.id}">${c.nome}</a></li>`).join("");
  return `
  <footer class="rodape">
    <div class="container">
      <div class="rodape__grelha">
        <div class="rodape__marca">
          <a class="marca" href="index.html" aria-label="Yoha Eventos">
            <img src="assets/img/monograma-dourado.png" alt="">
            <span class="marca__nome">YOHA<b>EVENTOS</b></span>
          </a>
          <p>A plataforma para encontrar fornecedores de confiança e organizar qualquer evento em Angola — num só lugar.</p>
          <div class="rodape__redes">
            <a href="#" aria-label="Instagram">${ICONES.instagram}</a>
            <a href="#" aria-label="Facebook">${ICONES.facebook}</a>
            <a href="#" aria-label="LinkedIn">${ICONES.linkedin}</a>
            <a href="https://wa.me/${WHATSAPP_GERAL}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICONES.whatsapp}</a>
          </div>
        </div>
        <div>
          <h4>Fornecedores</h4>
          <ul>${cats}<li><a href="fornecedores.html">Ver todos</a></li></ul>
        </div>
        <div>
          <h4>Plataforma</h4>
          <ul>
            <li><a href="planeador.html">Planeador de eventos</a></li>
            <li><a href="calculadora.html">Calculadora de orçamento</a></li>
            <li><a href="para-fornecedores.html">Para fornecedores</a></li>
            <li><a href="entrar.html#criar">Criar conta</a></li>
            <li><a href="sobre.html">Quem somos</a></li>
          </ul>
        </div>
        <div>
          <h4>Contacto</h4>
          <ul class="rodape__contactos">
            <li><a href="tel:+244900000000">+244 900 000 000</a></li>
            <li><a href="mailto:geral@yohaeventos.ao">geral@yohaeventos.ao</a></li>
            <li>Luanda, Angola</li>
            <li><a href="contacto.html">Enviar mensagem</a></li>
          </ul>
        </div>
      </div>
      <div class="rodape__base">
        <span>© ${ano} Yoha Eventos. Todos os direitos reservados.</span>
        <nav aria-label="Legal">
          <a href="#">Política de privacidade</a><a href="#">Termos de serviço</a><a href="#">Cookies</a>
        </nav>
      </div>
    </div>
  </footer>
  <div class="aviso" role="status" aria-live="polite"></div>`;
}

function montarEstrutura() {
  const topo = document.getElementById("site-cabecalho");
  const base = document.getElementById("site-rodape");
  if (topo) topo.outerHTML = cabecalhoHTML();
  if (base) base.outerHTML = rodapeHTML();

  // Página actual no menu
  const pagina = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav > a").forEach((a) => {
    if (a.getAttribute("href") === pagina) a.setAttribute("aria-current", "page");
  });
  if (pagina === "fornecedor.html") document.querySelector('.nav > a[href="fornecedores.html"]')?.setAttribute("aria-current", "page");

  document.querySelectorAll("[data-sair]").forEach((b) => b.addEventListener("click", terminarSessao));

  // Painel da conta (abre ao clicar no ícone)
  const conta = document.querySelector(".conta");
  if (conta) {
    const btn = conta.querySelector(".conta__botao");
    const painel = conta.querySelector(".conta__painel");
    const abrir = (sim) => {
      conta.classList.toggle("aberta", sim);
      btn.setAttribute("aria-expanded", sim);
      if (sim) {
        // posiciona a seta do painel por baixo do ícone
        const b = btn.getBoundingClientRect(), pr = painel.getBoundingClientRect();
        painel.style.setProperty("--seta-x", `${b.left + b.width / 2 - pr.left}px`);
        document.body.classList.remove("menu-aberto");
        document.body.style.overflow = "";
        setTimeout(() => painel.querySelector("a, button")?.focus({ preventScroll: true }), 180);
      }
    };
    btn.addEventListener("click", (e) => { e.stopPropagation(); abrir(!conta.classList.contains("aberta")); });
    document.addEventListener("click", (e) => { if (!conta.contains(e.target)) abrir(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && conta.classList.contains("aberta")) { abrir(false); btn.focus(); }
    });
  }

  // Menu móvel
  const botao = document.querySelector(".menu-toggle");
  botao?.addEventListener("click", () => {
    document.querySelector(".conta")?.classList.remove("aberta");
    const aberto = document.body.classList.toggle("menu-aberto");
    botao.setAttribute("aria-expanded", aberto);
    document.body.style.overflow = aberto ? "hidden" : "";
  });

}

/* Animação de entrada ao fazer scroll */
function activarRevelar() {
  const els = document.querySelectorAll(".revelar:not(.visivel)");
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("visivel")); return; }
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visivel"); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
  els.forEach((el) => obs.observe(el));
}

/* Aviso temporário */
let avisoTimer;
function mostrarAviso(texto) {
  const el = document.querySelector(".aviso");
  if (!el) return;
  el.textContent = texto;
  el.classList.add("visivel");
  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => el.classList.remove("visivel"), 3200);
}

/* Ligação de WhatsApp com mensagem preparada */
function linkWhatsapp(f) {
  const msg = encodeURIComponent(`Olá ${f.nome}! Vi o vosso perfil na Yoha Eventos e gostaria de pedir um orçamento.`);
  return `https://wa.me/${f.whatsapp}?text=${msg}`;
}

/* Cartão de fornecedor (diretório, destaques, relacionados) */
function cartaoFornecedor(f) {
  const cat = categoriaPorId(f.categoria);
  const cap = f.capacidade ? `<span>${ICONES.pessoas} ${f.capacidade[0]}–${f.capacidade[1]} pessoas</span>` : "";
  return `
    <article class="cartao revelar">
      <a class="cartao__imagem" href="fornecedor.html?id=${f.id}" tabindex="-1" aria-hidden="true">
        <img src="${f.imagem}" alt="" loading="lazy">
        ${f.verificado ? `<span class="cartao__selo">${ICONES.verificado} Verificado</span>` : ""}
        <span class="cartao__categoria">${cat.nome}</span>
      </a>
      <div class="cartao__corpo">
        <h3><a href="fornecedor.html?id=${f.id}">${f.nome}</a></h3>
        <div class="cartao__local"><span>${ICONES.local} ${f.local}, ${f.provincia}</span>${cap}</div>
        <p>${f.resumo}</p>
        <div class="cartao__rodape">
          <span class="cartao__preco">Desde<strong>${formatarKz(f.precoDesde)}</strong></span>
          <a class="btn btn--whatsapp" href="${linkWhatsapp(f)}" target="_blank" rel="noopener">${ICONES.whatsapp} WhatsApp</a>
        </div>
      </div>
    </article>`;
}

document.addEventListener("DOMContentLoaded", () => {
  montarEstrutura();
  document.querySelectorAll(".link-seta, [data-seta]").forEach((a) => a.insertAdjacentHTML("beforeend", SETA));
  activarRevelar();
});
