/* Entrar / Criar conta
   NOTA: esta versão é apenas a interface. As contas reais precisam de um servidor
   (backend) com base de dados — as palavras-passe NUNCA devem ser guardadas no navegador. */

const destino = () => {
  const v = new URLSearchParams(location.search).get("voltar") || "planeador.html";
  return /^[\w-]+\.html/.test(v) ? v : "planeador.html";   // só páginas do próprio site
};
if (utilizador()) location.replace(destino());

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("entrar-foto").src = foto(FOTOS.eventos.casamento, 1200);

  const separadores = document.querySelectorAll("[data-sep]");
  const mostrar = (qual) => {
    separadores.forEach((b) => { const a = b.dataset.sep === qual; b.classList.toggle("activo", a); b.setAttribute("aria-selected", a); });
    document.getElementById("form-entrar").hidden = qual !== "entrar";
    document.getElementById("form-criar").hidden = qual !== "criar";
  };
  separadores.forEach((b) => b.addEventListener("click", () => mostrar(b.dataset.sep)));
  if (location.hash === "#criar") mostrar("criar");

  const emailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  document.getElementById("form-entrar").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    if (!emailValido(d.email) || !d.senha) return mostrarAviso("Indique um email válido e a palavra-passe.");
    const u = JSON.parse(localStorage.getItem("yoha_utilizador") || "null");
    localStorage.setItem("yoha_utilizador", JSON.stringify({ nome: u?.email === d.email ? u.nome : d.email.split("@")[0], email: d.email, perfil: u?.perfil || "cliente" }));
    location.href = destino();
  });

  document.getElementById("form-criar").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    if (!d.nome.trim()) return mostrarAviso("Indique o seu nome.");
    if (!emailValido(d.email)) return mostrarAviso("Indique um email válido.");
    if ((d.senha || "").length < 8) return mostrarAviso("A palavra-passe deve ter pelo menos 8 caracteres.");
    localStorage.setItem("yoha_utilizador", JSON.stringify({ nome: d.nome.trim(), email: d.email, telefone: d.telefone, perfil: d.perfil }));
    location.href = d.perfil === "fornecedor" ? "para-fornecedores.html#registo" : destino();
  });
});
