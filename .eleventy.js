// Filters
const dateFilter = require('./src/filters/date-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');

// Sanity filters
const blocksToHtml = require('@sanity/block-content-to-html')
const svgContents = require("eleventy-plugin-svg-contents");
const urlFor = require('./utils/imageUrl');

// Transforms
const htmlMinTransform = require("./src/_transforms/html-min-transform.js");

// production filter
const isProduction = process.env.NODE_ENV === "production";


module.exports = (config) => {

  config.addPassthroughCopy({ "src/_assets/fonts": "fonts" });
  config.addPassthroughCopy({ "./src/_assets/js/main.js": "./js/main.js" });
  config.addPassthroughCopy("favicon.svg");
  config.addPlugin(svgContents);

  config.addNunjucksFilter("limit", (arr, limit) => arr.slice(0, limit));

  config.addFilter('sanityToHTML', function(value) {
    return blocksToHtml({
      blocks: value,
    })
  })

  config.addFilter('dateFilter', dateFilter);
  config.addFilter('w3DateFilter', w3DateFilter);

  if (isProduction) {
    config.addTransform('htmlmin', htmlMinTransform);
  }

  config.addShortcode('imageUrlFor', (image, width="400") => {
    return urlFor(image)
      .width(width)
      .auto('format')
  })

  config.addShortcode('croppedUrlFor', (image,width,height) => {
    return urlFor(image)
      .width(width)
      .height(height)
      .auto('format')
      .quality('70')
  })

  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  };

  config.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
  );

  config.addFilter("markdownify", function(value) {
    const md = new markdownIt(options)
    return md.render(value)
  })

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
