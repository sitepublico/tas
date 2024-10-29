/***

  Este script prepara os conteúdos para a criação do site estático com "@11ty/eleventy".
  - transforma os arquivos .csv do diretório "conteudo" em arquivos .md no diretório de trabalho ("src").
  - copia os arquivos .md do diretório "conteudo" para o diretório de trabalho ("src").
  
***/

const fs = require('fs');
const csv = require('csvtojson');
const path = require('path');

// Função para sanitizar strings para serem usadas em nomes de arquivos
function sanitizeFilename(str) {
  return str
    .toString()
    .normalize('NFD')                   // Normaliza a string
    .replace(/[\u0300-\u036f]/g, '')    // Remove acentos
    .replace(/\s+/g, '-')               // Substitui espaços por hífens
    .replace(/[^a-zA-Z0-9\-]/g, '')     // Remove caracteres especiais
    .replace(/\-+/g, '-')               // Remove múltiplos hífens
    .toLowerCase();                     // Converte para minúsculas
}

// Função para escapar valores do YAML
function yamlEscape(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return `"${str.replace(/"/g, '\\"')}"`;
}

// Função para copiar arquivos .md de conteudo para src
function copyMarkdownFiles() {
  const sourceDir = './conteudo/';
  const targetDir = './src/';

  // Verifica se o diretório de destino existe, caso contrário, cria
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Lê todos os arquivos do diretório de origem
  fs.readdir(sourceDir, (err, files) => {
    if (err) {
      console.error('Erro ao ler o diretório de origem:', err);
      return;
    }

    files.forEach(file => {
      if (path.extname(file) === '.md') {
        // Copia o arquivo para o diretório de destino
        fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
        console.log(`Arquivo ${file} copiado para ${targetDir}`);
      }
    });
  });
}

// Chama a função para copiar os arquivos .md
copyMarkdownFiles();

// Função para converter tecnologias.csv
csv()
  .fromFile('./conteudo/tecnologias.csv')
  .then((jsonObj) => {
    // Criar diretório para tecnologias
    if (!fs.existsSync('./src/tecnologias')) {
      fs.mkdirSync('./src/tecnologias', { recursive: true });
    }

    // Obter categorias únicas e suas descrições
    const categoriasMap = new Map();
    jsonObj.forEach(item => {
      const categoria = item.categoria;
      const descricaoCategoria = item.descricao_categoria || '';
      if (!categoriasMap.has(categoria)) {
        categoriasMap.set(categoria, descricaoCategoria);
      }
    });

    // Criar arquivos de categoria
    categoriasMap.forEach((descricaoCategoria, categoria) => {
      const slugCategoria = sanitizeFilename(categoria);
      const tecnologiasCategoria = jsonObj.filter(item => item.categoria === categoria);

      // Criar arquivo Markdown para a categoria
      const categoriaContent = `---
layout: categoria.njk
title: ${yamlEscape(categoria)}
categoria: ${yamlEscape(categoria)}
descricao_categoria: ${yamlEscape(descricaoCategoria)}
permalink: /tecnologias-${slugCategoria}/
---
`;

      fs.writeFileSync(`./src/tecnologias-${slugCategoria}.md`, categoriaContent);
      console.log(`Arquivo tecnologias-${slugCategoria}.md criado em ./src/`);

      // Criar arquivos Markdown para cada tecnologia
      tecnologiasCategoria.forEach(tecnologia => {
        const slugTecnologia = tecnologia.slug ? sanitizeFilename(tecnologia.slug) : sanitizeFilename(tecnologia.titulo);

        const tecnologiaContent = `---
layout: tecnologia.njk
title: ${yamlEscape(tecnologia.titulo)}
titulo: ${yamlEscape(tecnologia.titulo)}
slug: ${slugTecnologia}
categoria: ${yamlEscape(tecnologia.categoria)}
imagem: ${yamlEscape(tecnologia.imagem)}
descricao: ${yamlEscape(tecnologia.descricao)}
orientacao: ${yamlEscape(tecnologia.orientacao)}
dicas: ${yamlEscape(tecnologia.dicas)}
etapas_justificativa: ${yamlEscape(tecnologia.etapas_justificativa)}
custo: ${yamlEscape(tecnologia.custo)}
requer_internet: ${yamlEscape(tecnologia.requer_internet)}
etapas: ${yamlEscape(tecnologia.etapas)}
plataformas: ${yamlEscape(tecnologia.plataformas)}
autor: ${yamlEscape(tecnologia.autor)}
autor_contato: ${yamlEscape(tecnologia.autor_contato)}
link: ${yamlEscape(tecnologia.link)}
permalink: /tecnologias/${slugTecnologia}/
---
${tecnologia.descricao}
`;

        fs.writeFileSync(`./src/tecnologias/${slugTecnologia}.md`, tecnologiaContent);
        console.log(`Arquivo ${slugTecnologia}.md criado em ./src/tecnologias/`);

      });
    });


    // Criar índice de tecnologias
    const indexContent = `---
layout: tecnologias.njk
title: Tecnologias
permalink: /tecnologias/
---
`;

    fs.writeFileSync('./src/tecnologias.md', indexContent);
    console.log(`Arquivo tecnologias.md criado em ./src/`);
  });

// Função para converter recursos.csv
csv()
  .fromFile('./conteudo/recursos.csv')
  .then((jsonObj) => {
    // Obter categorias únicas
    const categorias = [...new Set(jsonObj.map(item => item.categoria))];

    // Criar índice de recursos
    const indexContent = `---
layout: recursos.njk
title: Recursos
permalink: /recursos/
---
`;

    fs.writeFileSync('./src/recursos.md', indexContent);
    console.log(`Arquivo recursos.md criado em ./src/`);

    // Criar arquivos Markdown para cada categoria de recursos
    categorias.forEach(categoria => {
      const slugCategoria = sanitizeFilename(categoria);
      const recursosCategoria = jsonObj.filter(item => item.categoria === categoria);

      // Criar conteúdo Markdown com a lista de recursos da categoria
      let recursosList = '';
      recursosCategoria.forEach(recurso => {
        recursosList += `- **${recurso.titulo}**
  - Plataforma: ${recurso.plataforma}
  - Descrição: ${recurso.descricao}
  - Link: [Acesse aqui](${recurso.link})

`;
      });

      // Criar arquivo Markdown para a categoria
      const categoriaContent = `---
layout: recurso-categoria.njk
title: ${yamlEscape(categoria)}
categoria: ${yamlEscape(categoria)}
permalink: /recursos-${slugCategoria}/
---
${recursosList}
`;

      fs.writeFileSync(`./src/recursos-${slugCategoria}.md`, categoriaContent);
      console.log(`Arquivo recursos-${slugCategoria}.md criado em ./src/`);
    });
  });
