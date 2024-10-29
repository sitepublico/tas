# Tecnologias Assistivas para Surdos

Este é um site estático criado com [Eleventy](https://www.11ty.dev/), [Nunjucks](https://mozilla.github.io/nunjucks/), e [csvtojson](https://www.npmjs.com/package/csvtojson). O projeto apresenta um catálogo de tecnologias assistivas para surdos, com informações organizadas a partir de arquivos CSV.

## Índice

- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Publicação](#publicação)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Contato](#contato)

## Funcionalidades

- Listagem de categorias de tecnologias assistivas para surdos.
- Detalhamento de cada tecnologia com informações específicas.
- Listagem de recursos agrupados por categoria.
- Páginas institucionais: Sobre, Contato, Tecnologias Assistivas.
- Página inicial com acesso rápido às categorias de tecnologias e recursos.

## Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/)

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/sitepublico/tas/
   ```

2. **Acesse o diretório do projeto:**

   ```bash
   cd tas
   ```

3. **Instale as dependências:**

   ```bash
   npm install
   ```

## Como Usar

### Executar o Projeto Localmente

1. **Gerar os arquivos a partir dos CSVs:**

   ```bash
   node processar-conteudo.js
   ```

2. **Construir o site com o Eleventy:**

   ```bash
   npm run build
   ```

3. **Servir o site localmente:**

   Você pode usar um servidor estático como o `serve`:

   ```bash
   npx serve _site
   ```

   Acesse `http://localhost:5000` no seu navegador para visualizar o site.

### Desenvolvimento

Para facilitar o desenvolvimento, você pode usar o modo de observação do Eleventy, que reconstrói o site sempre que houver mudanças nos arquivos:

```bash
npx eleventy --serve
```

O site estará disponível em `http://localhost:8080`.

## Estrutura do Projeto

```
├── .eleventy.js            # Configuração do Eleventy
├── .gitignore              # Configuração do git
├── package.json            # Dependências e scripts do npm
├── processar-conteudo.js   # Script para converter CSVs em arquivos Markdown
├── assets/                 # Arquivos de imagem, CSS e javascript
├── conteudo/               # Arquivos de conteúdo (CSVs e Markdown)
├── layouts/                # Templates Nunjucks
└── src/                    # Arquivos gerados para o Eleventy

```

Após o `build`, o projeto cria o diretório `_site`, contendo os arquivos HTML para publicação.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.