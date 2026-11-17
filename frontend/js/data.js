/* ==========================================================================
   YOHA EVENTOS — dados da plataforma
   Nota: os fornecedores abaixo são DADOS DE EXEMPLO para desenvolvimento.
   Substitua-os pelos fornecedores reais (ou ligue a uma API/base de dados).
   ========================================================================== */

const PROVINCIAS = [
  "Luanda", "Benguela", "Huíla", "Huambo", "Cabinda", "Namibe", "Bié",
  "Malanje", "Uíge", "Zaire", "Cuanza Norte", "Cuanza Sul", "Cunene",
  "Lunda Norte", "Lunda Sul", "Moxico", "Cuando Cubango", "Bengo"
];

const TIPOS_EVENTO = [
  { id: "casamento", nome: "Casamento" },
  { id: "pedido", nome: "Pedido & Alambamento" },
  { id: "noivado", nome: "Noivado" },
  { id: "aniversario", nome: "Aniversário" },
  { id: "baptizado", nome: "Baptizado" },
  { id: "graduacao", nome: "Graduação" },
  { id: "corporativo", nome: "Evento Corporativo" },
  { id: "conferencia", nome: "Conferência" },
  { id: "chadebebe", nome: "Chá de Bebé" },
  { id: "chadepanela", nome: "Chá de Panela" },
  { id: "bodas", nome: "Bodas & Renovação" },
  { id: "lancamento", nome: "Lançamento de Marca" },
  { id: "gala", nome: "Gala & Jantar" },
  { id: "workshop", nome: "Workshop" },
  { id: "festainfantil", nome: "Festa Infantil" },
  { id: "sessaofoto", nome: "Sessão Fotográfica" }
];

/* Ícones em linha (SVG) — traço fino, sem preenchimento */
const ICONES = {
  espacos: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor"><path d="M4 28h24M6 28V13l10-7 10 7v15M12 28v-8h8v8M3 14l13-9 13 9"/></svg>',
  fotografia: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor"><path d="M4 10h6l2-3h8l2 3h6v16H4z"/><circle cx="16" cy="17" r="5"/><path d="M24 13h1"/></svg>',
  decoracao: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor"><path d="M16 28V15"/><path d="M16 15c-5 0-8-3-8-8 5 0 8 3 8 8zM16 15c5 0 8-3 8-8-5 0-8 3-8 8z"/><path d="M16 21c-3 0-5-2-5-5M16 21c3 0 5-2 5-5"/></svg>',
  catering: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor"><path d="M5 22h22M7 22a9 9 0 0 1 18 0M16 13v-2M14 11h4M3 26h26"/></svg>',
  musica: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor"><path d="M12 24V7l14-3v17"/><circle cx="8.5" cy="24" r="3.5"/><circle cx="22.5" cy="21" r="3.5"/><path d="M12 12l14-3"/></svg>',
  bolos: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor"><path d="M6 28V19h20v9M9 19v-6h14v6M12 13V9h8v4M16 9V5M4 28h24"/></svg>',
  beleza: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor"><path d="M11 28V14h6v14M12 14l1-6h2l1 6M21 28V10M19 10h4l-1-5h-2z"/></svg>',
  trajes: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor"><path d="M12 4l4 4 4-4M12 4l-2 6 3 3-5 15h16l-5-15 3-3-2-6"/></svg>',
  convites: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor"><rect x="4" y="8" width="24" height="17"/><path d="M4 8l12 9 12-9"/></svg>',
  transporte: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor"><path d="M3 21v-5l3-6h14l5 6h4v5z"/><circle cx="9" cy="22" r="2.5"/><circle cx="23" cy="22" r="2.5"/><path d="M8 16h16"/></svg>',
  animacao: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor"><path d="M16 4l2.8 8.2H27l-6.6 5 2.5 8.3L16 20.4 9.1 25.5l2.5-8.3L5 12.2h8.2z"/></svg>',
  cerimonia: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor"><rect x="12" y="4" width="8" height="13" rx="4"/><path d="M8 14a8 8 0 0 0 16 0M16 22v6M11 28h10"/></svg>'
};

const CATEGORIAS = [
  { id: "espacos", nome: "Espaços & Salões", desc: "Quintas, salões, hotéis e jardins" },
  { id: "fotografia", nome: "Fotografia & Vídeo", desc: "Reportagem, filme e drone" },
  { id: "decoracao", nome: "Decoração & Flores", desc: "Cenografia, arranjos e iluminação" },
  { id: "catering", nome: "Catering", desc: "Banquetes, buffet e serviço de mesa" },
  { id: "musica", nome: "DJ & Música ao Vivo", desc: "DJs, bandas e som profissional" },
  { id: "bolos", nome: "Bolos & Doçaria", desc: "Bolos de cerimónia e mesa de doces" },
  { id: "beleza", nome: "Beleza & Estética", desc: "Maquilhagem, cabelo e spa" },
  { id: "trajes", nome: "Trajes & Alfaiataria", desc: "Vestidos, fatos e panos tradicionais" },
  { id: "convites", nome: "Convites & Papelaria", desc: "Convites impressos e digitais" },
  { id: "transporte", nome: "Transporte", desc: "Viaturas clássicas e de luxo" },
  { id: "animacao", nome: "Animação", desc: "Animadores, bailarinos e actividades" },
  { id: "cerimonia", nome: "Mestres de Cerimónia", desc: "Apresentação e protocolo" }
];

/* Fornecedores — DADOS DE EXEMPLO (nomes fictícios) */
const FORNECEDORES = [
  {
    id: "quinta-das-acacias", nome: "Quinta das Acácias", categoria: "espacos", provincia: "Luanda", local: "Talatona",
    precoDesde: 450000, unidade: "por evento", capacidade: [80, 600], destaque: true, verificado: true, tom: 1,
    resumo: "Jardim e salão envidraçado para cerimónias ao ar livre e receções até 600 convidados.",
    descricao: "Espaço com jardim relvado, capela exterior e salão climatizado com vista para o lago. Inclui parque de estacionamento privado, gerador de apoio, cozinha de apoio para catering e sala de preparação para os noivos.",
    servicos: [["Aluguer do espaço (dia inteiro)", "450 000 Kz"], ["Cerimónia no jardim", "120 000 Kz"], ["Gerador e segurança", "Incluído"], ["Mesas e cadeiras base", "Incluído"]],
    whatsapp: "244900000000"
  },
  {
    id: "luz-de-mussulo", nome: "Estúdio Luz de Mussulo", categoria: "fotografia", provincia: "Luanda", local: "Ilha de Luanda",
    precoDesde: 280000, unidade: "por reportagem", destaque: true, verificado: true, tom: 2,
    resumo: "Fotografia documental de casamentos, com filme cinematográfico e álbum de autor.",
    descricao: "Equipa de dois fotógrafos e um videógrafo. Trabalhamos de forma discreta, com foco nos momentos reais. Entrega da galeria online em 30 dias e álbum impresso em papel de algodão.",
    servicos: [["Reportagem fotográfica (8h)", "280 000 Kz"], ["Filme de casamento", "220 000 Kz"], ["Imagens com drone", "60 000 Kz"], ["Álbum de autor 30×30", "95 000 Kz"]],
    whatsapp: "244900000001"
  },
  {
    id: "atelier-imbondeiro", nome: "Atelier Imbondeiro", categoria: "decoracao", provincia: "Luanda", local: "Miramar",
    precoDesde: 350000, unidade: "por evento", destaque: true, verificado: true, tom: 3,
    resumo: "Cenografia floral e decoração de autor para casamentos e eventos de marca.",
    descricao: "Desenhamos cada projecto de raiz: estudo de cor, maqueta da sala, arranjos florais, iluminação cénica e montagem completa no dia.",
    servicos: [["Projecto de decoração", "Desde 350 000 Kz"], ["Arco floral de cerimónia", "140 000 Kz"], ["Centros de mesa (un.)", "18 000 Kz"], ["Iluminação cénica", "90 000 Kz"]],
    whatsapp: "244900000002"
  },
  {
    id: "mesa-da-avo", nome: "Mesa da Avó Catering", categoria: "catering", provincia: "Luanda", local: "Viana",
    precoDesde: 9500, unidade: "por convidado", destaque: true, verificado: true, tom: 5,
    resumo: "Cozinha angolana e internacional, do muamba de galinha ao jantar empratado.",
    descricao: "Serviço completo com chefe, empregados de mesa, loiça e toalhas. Menus de degustação disponíveis antes do evento.",
    servicos: [["Buffet tradicional", "9 500 Kz / pax"], ["Jantar empratado", "14 000 Kz / pax"], ["Cocktail de boas-vindas", "4 000 Kz / pax"], ["Bar aberto (5h)", "6 500 Kz / pax"]],
    whatsapp: "244900000003"
  },
  {
    id: "dj-kizomba-lux", nome: "Kalunga Sound", categoria: "musica", provincia: "Luanda", local: "Kilamba",
    precoDesde: 180000, unidade: "por evento", destaque: false, verificado: true, tom: 4,
    resumo: "DJ, som e luz para festas — kizomba, semba, afro house e clássicos.",
    descricao: "Sistema de som line-array, iluminação de pista e microfones sem fio para discursos. Reunião prévia para alinhar o alinhamento musical.",
    servicos: [["DJ + som (6h)", "180 000 Kz"], ["Iluminação de pista", "60 000 Kz"], ["Hora extra", "25 000 Kz"]],
    whatsapp: "244900000004"
  },
  {
    id: "doce-mukua", nome: "Doce Múkua", categoria: "bolos", provincia: "Benguela", local: "Lobito",
    precoDesde: 85000, unidade: "por bolo", destaque: false, verificado: true, tom: 3,
    resumo: "Bolos de cerimónia e mesas de doces com sabores locais.",
    descricao: "Recheios de múkua, maracujá e coco. Provas de sabores por marcação e entrega com montagem no local.",
    servicos: [["Bolo de 3 andares", "85 000 Kz"], ["Mesa de doces (100 pax)", "120 000 Kz"], ["Bem-casados (un.)", "600 Kz"]],
    whatsapp: "244900000005"
  },
  {
    id: "salao-baia-azul", nome: "Salão Baía Azul", categoria: "espacos", provincia: "Benguela", local: "Benguela",
    precoDesde: 300000, unidade: "por evento", capacidade: [100, 450], destaque: true, verificado: false, tom: 1,
    resumo: "Salão junto ao mar com terraço para cocktails ao pôr-do-sol.",
    descricao: "Salão principal para 450 convidados, terraço exterior e cozinha industrial. Ideal para casamentos e galas.",
    servicos: [["Aluguer do salão", "300 000 Kz"], ["Terraço (cocktail)", "80 000 Kz"], ["Limpeza final", "Incluído"]],
    whatsapp: "244900000006"
  },
  {
    id: "beleza-nzinga", nome: "Nzinga Beauty Studio", categoria: "beleza", provincia: "Luanda", local: "Alvalade",
    precoDesde: 65000, unidade: "por noiva", destaque: false, verificado: true, tom: 5,
    resumo: "Maquilhagem e penteados de noiva, com serviço ao domicílio.",
    descricao: "Prova de maquilhagem incluída. Equipa para noiva, mães e madrinhas no próprio dia.",
    servicos: [["Maquilhagem de noiva + prova", "65 000 Kz"], ["Penteado de noiva", "40 000 Kz"], ["Convidadas (por pessoa)", "18 000 Kz"]],
    whatsapp: "244900000007"
  },
  {
    id: "panos-kianda", nome: "Kianda Alfaiataria", categoria: "trajes", provincia: "Luanda", local: "Maianga",
    precoDesde: 120000, unidade: "por peça", destaque: false, verificado: true, tom: 2,
    resumo: "Fatos por medida e trajes em tecido africano para noivos e cortejo.",
    descricao: "Alfaiataria de autor com três provas. Coordenação de cores para padrinhos e damas de honor.",
    servicos: [["Fato de noivo por medida", "180 000 Kz"], ["Vestido em pano africano", "120 000 Kz"], ["Pacote cortejo (6 peças)", "Sob consulta"]],
    whatsapp: "244900000008"
  },
  {
    id: "papel-e-tinta", nome: "Papel & Tinta", categoria: "convites", provincia: "Huíla", local: "Lubango",
    precoDesde: 1500, unidade: "por convite", destaque: false, verificado: false, tom: 3,
    resumo: "Convites impressos em letterpress e convites digitais com confirmação.",
    descricao: "Design personalizado, impressão em papel texturado e versão digital com página de RSVP.",
    servicos: [["Convite impresso (un.)", "1 500 Kz"], ["Convite digital + RSVP", "45 000 Kz"], ["Menus e marcadores", "Sob consulta"]],
    whatsapp: "244900000009"
  },
  {
    id: "classicos-de-luanda", nome: "Clássicos de Luanda", categoria: "transporte", provincia: "Luanda", local: "Maculusso",
    precoDesde: 150000, unidade: "por serviço", destaque: false, verificado: true, tom: 4,
    resumo: "Viaturas clássicas e de luxo com motorista fardado.",
    descricao: "Frota com Mercedes clássico, Rolls-Royce e SUVs para cortejo. Decoração floral da viatura disponível.",
    servicos: [["Viatura clássica (4h)", "150 000 Kz"], ["SUV para cortejo (un.)", "60 000 Kz"], ["Decoração da viatura", "25 000 Kz"]],
    whatsapp: "244900000010"
  },
  {
    id: "mc-palavra-certa", nome: "Palavra Certa — MC", categoria: "cerimonia", provincia: "Huambo", local: "Huambo",
    precoDesde: 90000, unidade: "por evento", destaque: false, verificado: true, tom: 5,
    resumo: "Mestre de cerimónias bilingue para casamentos e eventos corporativos.",
    descricao: "Condução do programa, protocolo, dinâmicas com convidados e coordenação com DJ e catering.",
    servicos: [["Apresentação do evento", "90 000 Kz"], ["Protocolo corporativo", "Sob consulta"]],
    whatsapp: "244900000011"
  },
  {
    id: "jardim-tundavala", nome: "Jardim Tundavala", categoria: "espacos", provincia: "Huíla", local: "Lubango",
    precoDesde: 220000, unidade: "por evento", capacidade: [50, 300], destaque: false, verificado: true, tom: 4,
    resumo: "Jardim de montanha para cerimónias intimistas e copos-d'água.",
    descricao: "Espaço verde com tenda estruturada, zona de lounge e cozinha de apoio.",
    servicos: [["Aluguer do jardim", "220 000 Kz"], ["Tenda estruturada", "150 000 Kz"]],
    whatsapp: "244900000012"
  },
  {
    id: "festa-viva", nome: "Festa Viva Animação", categoria: "animacao", provincia: "Luanda", local: "Benfica",
    precoDesde: 70000, unidade: "por evento", destaque: false, verificado: false, tom: 1,
    resumo: "Animadores infantis, pinturas faciais e insufláveis.",
    descricao: "Programas de animação por idade, com monitores certificados e material próprio.",
    servicos: [["Animação 3h (2 monitores)", "70 000 Kz"], ["Insuflável", "35 000 Kz"], ["Pinturas faciais", "20 000 Kz"]],
    whatsapp: "244900000013"
  }
];

/* Utilitários de dados */
const formatarKz = (v) => new Intl.NumberFormat("pt-PT").format(Math.round(v)) + " Kz";
const categoriaPorId = (id) => CATEGORIAS.find((c) => c.id === id);
const fornecedorPorId = (id) => FORNECEDORES.find((f) => f.id === id);

/* ==========================================================================
   FOTOGRAFIAS (Unsplash — uso gratuito). Para usar fotografias próprias,
   coloque-as em assets/img/ e substitua o endereço, ex.: "assets/img/salao.jpg"
   ========================================================================== */
const foto = (id, w = 900, h = 0) =>
  id.startsWith("assets/") ? id
    : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=75`;

const FOTOS = {
  hero: "1608009232260-9b527a5bb9bd",
  heroAlt: "1784202388318-a2caaeffe4b7",
  fornecedoresCta: "1769812344081-92b3e2ac39c0",
  eventos: {
    casamento: "1695281536457-01f9a07c575b",
    pedido: "1660675133902-acd1b057f75d",
    aniversario: "1714978444614-7a197c2309ee",
    corporativo: "1768508950719-4d76978fdf44",
    conferencia: "1587825140708-dfaf72ae4b04",
    chadebebe: "1768776183122-95c7d3adbf3e",
    graduacao: "1627556704290-2b1f5853ff78",
    gala: "1519167758481-83f550bb49b3",
    festainfantil: "1608790672275-309c02d888ff"
  },
  categorias: {
    espacos: "1763429338698-439aa108e7fb",
    fotografia: "1519741497674-611481863552",
    decoracao: "1775126964424-913480443772",
    catering: "1555244162-803834f70033",
    musica: "1541126274323-dbac58d14741",
    bolos: "1535254973040-607b474cb50d",
    beleza: "1657563920440-0ac6d8932f20",
    trajes: "1661332517932-2d441bfb2994",
    convites: "1632610992723-82d7c212f6d7",
    transporte: "1570907870057-e1e338bc0665",
    animacao: "1530103862676-de8c9debad1d",
    cerimonia: "1544531586-fde5298cdd40"
  },
  galerias: {
    espacos: ["1700514077430-3659e38eb5e7", "1670529776180-60e4132ab90c", "1607861884586-c7cfaed16290", "1523438885200-e635ba2c371e"],
    fotografia: ["1758810409996-583f3bad7d51", "1633150747731-c945ec51b663", "1695281535578-ce371088bb3e"],
    decoracao: ["1519225421980-715cb0215aed", "1649615644622-6d83f48e69c5", "1590683673322-0f3fabd72169"],
    catering: ["1576842546422-60562b9242ae", "1660120447916-123439b05c40", "1729708475294-fb3be3809dcb"],
    musica: ["1470225620780-dba8ba36b745", "1758944966810-9785cfbf4486", "1762674541314-dc97fde0006c"],
    bolos: ["1623428454614-abaf00244e52", "1525257831700-183b9b8bf5c4", "1761671613315-53157f91d0f8"],
    beleza: ["1501175635532-bdd01562edb2", "1648671095476-0b96886bc3c1", "1622277430358-f4d134452e2e"],
    trajes: ["1653242832879-d730d48617f9", "1621062089461-01f1eaebb66c", "1618999114008-fbf937170cdb"],
    convites: ["1764731080480-58b18e519bd9", "1770757685458-738fe8c72ab6", "1516617442634-75371039cb3a"],
    transporte: ["1592514313074-794923c98162", "1516536900061-d881b27e8ff8", "1729022508881-866e115a51d8"],
    animacao: ["1531956531700-dc0ee0f1f9a5", "1509666537727-9154b6962292", "1608790672275-309c02d888ff"],
    cerimonia: ["1540575467063-178a50c2df87", "1587825140708-dfaf72ae4b04", "1768508948835-7dbab7ca6d58"]
  }
};

/* Imagem principal e galeria de cada fornecedor (pode definir f.imagem / f.galeria manualmente) */
FORNECEDORES.forEach((f, i) => {
  const gal = FOTOS.galerias[f.categoria] || [];
  const principal = f.categoria === "espacos" && i % 2 ? gal[0] : FOTOS.categorias[f.categoria];
  f.imagem = f.imagem || foto(principal, 800, 550);
  f.galeria = f.galeria || [principal, ...gal.filter((g) => g !== principal)].slice(0, 3).map((id) => foto(id, 1200));
});

/* Ícones extra usados na interface */
Object.assign(ICONES, {
  seta: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 8h12M9 3l5 5-5 5"/></svg>',
  chevron: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 6l4 4 4-4"/></svg>',
  local: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  pessoas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/></svg>',
  verificado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 1.8 3-.2.9 2.9 2.5 1.7-1 2.8 1 2.8-2.5 1.7-.9 2.9-3-.2L12 22l-2.4-1.8-3 .2-.9-2.9-2.5-1.7 1-2.8-1-2.8 2.5-1.7.9-2.9 3 .2z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9.5"/><path d="M8 12.5l2.7 2.7L16 9.8"/></svg>',
  lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.79 14.06c-.24.68-1.42 1.3-1.95 1.35-.5.05-.97.24-3.27-.68-2.77-1.09-4.52-3.92-4.66-4.1-.13-.18-1.11-1.48-1.11-2.82 0-1.34.7-2 .95-2.27.25-.27.54-.34.72-.34h.52c.17 0 .39-.06.61.47.24.56.79 1.93.86 2.07.07.14.11.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.27.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.27.14.43.11.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.23.61-.14.25.09 1.59.75 1.86.89.27.14.45.2.52.32.07.11.07.66-.17 1.34z"/></svg>',
  calculadora: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="2.5" width="16" height="19" rx="2.5"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>',
  lista: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/></svg>',
  mesa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="3.5" r="1.5"/><circle cx="12" cy="20.5" r="1.5"/><circle cx="3.5" cy="12" r="1.5"/><circle cx="20.5" cy="12" r="1.5"/></svg>',
  contrato: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2.5H6.5A2 2 0 0 0 4.5 4.5v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z"/><path d="M14 2.5V8h5.5M8 13h8M8 17h5"/></svg>',
  calendario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg>',
  carteira: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 7V5.5A1.5 1.5 0 0 0 17.5 4h-12A2.5 2.5 0 0 0 3 6.5v11A2.5 2.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15"/><path d="M21 9.5h-5a2.5 2.5 0 0 0 0 5h5z"/></svg>',
  painel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7.5" height="9" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="5" rx="1.5"/><rect x="13.5" y="11" width="7.5" height="10" rx="1.5"/><rect x="3" y="15" width="7.5" height="6" rx="1.5"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4A21 21 0 0 0 14.3 4.3c-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.08V21h-4v-4.93c0-1.18-.02-2.7-1.64-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4z"/></svg>'
});

const WHATSAPP_GERAL = "244900000000";
