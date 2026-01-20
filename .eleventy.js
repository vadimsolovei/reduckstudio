module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("breakAfterFirst", function(str) {
    if (!str) return str;
    const parts = str.split(' ');
    if (parts.length <= 1) return str;
    return parts[0] + '<br>' + parts.slice(1).join(' ');
  });

  // Copy static assets as-is (no processing)
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/styles.compiled.css");
  eleventyConfig.addPassthroughCopy("src/assets/theme-dark.css");
  eleventyConfig.addPassthroughCopy("src/assets/theme-light.css");
  eleventyConfig.addPassthroughCopy("src/assets/script.js");

  // Watch for changes in CSS/JS during development
  eleventyConfig.addWatchTarget("src/assets/css/**/*.css");
  eleventyConfig.addWatchTarget("src/assets/styles.compiled.css");
  eleventyConfig.addWatchTarget("src/assets/theme-dark.css");
  eleventyConfig.addWatchTarget("src/assets/theme-light.css");
  eleventyConfig.addWatchTarget("src/assets/script.js");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
