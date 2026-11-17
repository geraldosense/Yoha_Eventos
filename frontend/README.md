# Yoha Eventos — plataforma de gestão de eventos

Site em HTML, CSS e JavaScript puro (sem frameworks, sem instalação).
Abre directamente no VS Code.

## Como abrir

1. Descompacte a pasta `yoha-eventos` e abra-a no VS Code (**Ficheiro → Abrir Pasta**).
2. Instale a extensão recomendada **Live Server** (o VS Code sugere-a automaticamente).
3. Clique com o botão direito em `index.html` → **Open with Live Server**.

Também funciona abrindo `index.html` directamente no navegador.

## Páginas

| Ficheiro | Conteúdo |
|---|---|
| `index.html` | Página inicial: pesquisa, tipos de evento, categorias, ferramentas, destaques |
| `fornecedores.html` | Diretório com filtros (categoria, província, preço, verificados) e ordenação |
| `fornecedor.html?id=...` | Perfil do fornecedor, serviços, pedido de orçamento, WhatsApp |
| `planeador.html` | Painel de gestão do evento: visão geral, checklist, orçamento, convidados, fornecedores |
| `para-fornecedores.html` | Página comercial com planos e formulário de registo |
| `calculadora.html` | Calculadora de orçamento por tipo de evento, convidados e província |
| `entrar.html` | Entrar / criar conta (só interface — precisa de backend) |
| `sobre.html` / `contacto.html` | Quem somos e formulário de contacto |

## Estrutura

```
yoha-eventos/
├── index.html
├── fornecedores.html
├── fornecedor.html
├── planeador.html
├── para-fornecedores.html
├── css/
│   ├── styles.css      ← estilos gerais e cores da marca (variáveis no topo)
│   └── painel.css      ← estilos do planeador
├── js/
│   ├── data.js         ← categorias, províncias, tipos de evento e fornecedores
│   ├── main.js         ← cabeçalho, rodapé, menu, cartões (partilhado)
│   ├── fornecedores.js ← filtros do diretório
│   ├── fornecedor.js   ← página de perfil
│   └── planeador.js    ← toda a lógica do painel de gestão
└── assets/img/         ← logótipos, favicon e (futuras) fotografias
```

## O que deve personalizar

- **Fornecedores:** os que estão em `js/data.js` são dados de exemplo. Substitua-os pelos reais.
- **Fotografias:** as imagens actuais vêm do Unsplash (uso gratuito, precisam de internet). Para usar
  fotografias próprias, coloque-as em `assets/img/` e troque os códigos no objecto `FOTOS` em `js/data.js`
  por `"assets/img/nome.jpg"`, ou defina `imagem` e `galeria` em cada fornecedor.
- **Contactos:** email, telefone e redes sociais estão em `js/main.js` (funções `cabecalhoHTML` e `rodapeHTML`).
- **Cores:** variáveis `--bordo-*` e `--ouro-*` no início de `css/styles.css`.
- **Preços dos planos:** em `para-fornecedores.html`.

## Dados

Nesta versão, os dados do planeador, os pedidos de orçamento e os registos de fornecedores
ficam guardados no navegador (`localStorage`). Para colocar em produção com contas de utilizador
será necessário um backend (ex.: Node.js + base de dados, Firebase ou Supabase). As funções
`carregar()` e `guardar()` em `js/planeador.js` são o ponto de ligação.

## Tipografia

- Toda a interface usa **Inter**, carregada do Google Fonts.
