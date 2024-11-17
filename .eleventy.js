module.exports = function (eleventyConfig) {
  // Collections
  eleventyConfig.addCollection('tecnologias', function (collectionApi) {
    return collectionApi.getFilteredByGlob('src/tecnologias/*.md');
  });

  eleventyConfig.addGlobalData("pathPrefix", process.env.ELEVENTY_ENV === "production" ? "/tas/" : "/");

  // Passthrough File Copy
  eleventyConfig.addPassthroughCopy('assets');

  // Tell Eleventy not to use .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Ignore dirs
  // eleventyConfig.ignores.add("**/node_modules/**");
  // eleventyConfig.ignores.add("README.md");
  // eleventyConfig.ignores.add("_site/");
  // eleventyConfig.ignores.add("conteudo/");

  // eleventy.config.js
  // Nunjucks filter to get text up to the first period
  eleventyConfig.addNunjucksFilter("split", function(value, delimiter) {
    if (typeof value === "string" && delimiter) {
      return value.split(delimiter).map(str => str.trim());
    }
    return [];
  });


  // Nunjucks filter to slugify text
  eleventyConfig.addNunjucksFilter('slugify', function (str) {
    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
  });

  return {
    dir: {
      input: 'src',
      includes: '../templates', // Adjust if necessary
      data: '_data',
      output: 'docs',
    },
    pathPrefix: process.env.ELEVENTY_ENV === "production" ? "/tas/" : "/",
  };
};
