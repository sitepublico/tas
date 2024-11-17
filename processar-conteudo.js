// processar-conteudo.js

const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const matter = require('gray-matter'); // Import gray-matter

// Paths
const conteudoDir = path.join(__dirname, 'conteudo');
const srcDir = path.join(__dirname, 'src');
const siteDir = path.join(__dirname, 'docs');
const tecnologiasCsvPath = path.join(conteudoDir, 'tecnologias.csv');
const recursosCsvPath = path.join(conteudoDir, 'recursos.csv');

// Function to delete a directory or file if it exists
function deletePath(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
    console.log(`Deleted: ${targetPath}`);
  }
}

// Delete 'docs' directory
deletePath(siteDir);
deletePath(srcDir);

// Ensure src directory exists
if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });

// Helper function to slugify text
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
}

// Function to copy all .md files from conteudo to src
function copyMarkdownFiles() {
  const files = fs.readdirSync(conteudoDir);
  files.forEach((file) => {
    if (file.endsWith('.md')) {
      const sourcePath = path.join(conteudoDir, file);
      let destPath;
      if (file === 'index.md') {
        // Copy index.md directly to src/
        destPath = path.join(srcDir, file);
      } else {
        // Copy other .md files to src/paginas/
        const paginasDir = path.join(srcDir, 'paginas');
        if (!fs.existsSync(paginasDir)) fs.mkdirSync(paginasDir, { recursive: true });
        destPath = path.join(paginasDir, file);
      }

      // Read the content and parse front matter
      const fileContent = fs.readFileSync(sourcePath, 'utf-8');
      const parsed = matter(fileContent);
      const existingFrontMatter = parsed.data;
      const contentBody = parsed.content;

      // Extract title from filename (if title not already provided)
      const titleFromFilename = file
        .replace('.md', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // Build the front matter object
      const frontMatter = {
        layout: file === 'index.md' ? 'index.njk' : 'paginas.njk',
        title: existingFrontMatter.title || titleFromFilename,
      };

      // Merge frontMatter into existingFrontMatter (your frontMatter takes precedence)
      const mergedFrontMatter = {
        ...existingFrontMatter,
        ...frontMatter,
      };

      // Reconstruct the file with merged front matter
      const pageContent = matter.stringify(contentBody.trim(), mergedFrontMatter);
      fs.writeFileSync(destPath, pageContent);
    }
  });
}

// Process tecnologias.csv
function processTecnologias() {
  const tecnologiasDir = path.join(srcDir, 'tecnologias');
  const tecnologiasDataDir = path.join(srcDir, '_data');
  if (!fs.existsSync(tecnologiasDir)) fs.mkdirSync(tecnologiasDir, { recursive: true });
  if (!fs.existsSync(tecnologiasDataDir)) fs.mkdirSync(tecnologiasDataDir, { recursive: true });

  csv()
    .fromFile(tecnologiasCsvPath)
    .then((tecnologias) => {
      // Write the tecnologias data to a JSON file
      const tecnologiasDataPath = path.join(tecnologiasDataDir, 'tecnologias.json');
      fs.writeFileSync(tecnologiasDataPath, JSON.stringify(tecnologias, null, 2));

      tecnologias.forEach((tec) => {
        const filename = `${tec.slug || tec.id}.md`;
        const filepath = path.join(tecnologiasDir, filename);

        // Build the front matter object
        const frontMatter = {
          layout: 'tecnologia.njk',
          titulo: tec.titulo,
          id: tec.id,
          descricao: tec.descricao,
          apresentacao: tec.apresentacao,
          orientacao: tec.orientacao,
          dicas: tec.dicas,
          etapas_justificativa: tec.etapas_justificativa,
          imagem: tec.imagem,
          slug: tec.slug,
          destaque: tec.destaque,
          categoria: tec.categoria,
          categoria_descricao: tec.categoria_descricao,
          custo: tec.custo,
          requer_internet: tec.requer_internet,
          etapas: tec.etapas,
          plataformas: tec.plataformas,
          autor: tec.autor,
          autor_contato: tec.autor_contato,
          link: tec.link,
          origem: tec.origem
        };

        // Convert front matter object to YAML string
        const frontMatterYAML = yaml.dump(frontMatter);

        const content = `---
${frontMatterYAML}---
${tec.descricao}
`;
        fs.writeFileSync(filepath, content);
      });
    })
    .catch((error) => {
      console.error('Error processing tecnologias.csv:', error);
    });
}

// Process recursos.csv
function processRecursos() {
  const recursosDataDir = path.join(srcDir, '_data');
  if (!fs.existsSync(recursosDataDir)) fs.mkdirSync(recursosDataDir, { recursive: true });

  csv()
    .fromFile(recursosCsvPath)
    .then((recursos) => {
      // Write the recursos data to a JSON file
      const recursosDataPath = path.join(recursosDataDir, 'recursos.json');
      fs.writeFileSync(recursosDataPath, JSON.stringify(recursos, null, 2));

      // Group recursos by category
      const recursosByCategory = recursos.reduce((acc, recurso) => {
        const category = recurso.categoria || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(recurso);
        return acc;
      }, {});

      const categorias = Object.keys(recursosByCategory);

      // Build the front matter object with categorias only
      const frontMatter = {
        layout: 'recursos.njk',
        title: 'Recursos',
        categorias: categorias,
      };

      const frontMatterYAML = yaml.dump(frontMatter);

      // Generate content
      let content = `---
${frontMatterYAML}---
`;

      const recursosPath = path.join(srcDir, 'recursos.md');
      fs.writeFileSync(recursosPath, content);
    })
    .catch((error) => {
      console.error('Error processing recursos.csv:', error);
    });
}

// Run the functions
copyMarkdownFiles();
processTecnologias();
processRecursos();
