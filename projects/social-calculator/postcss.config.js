module.exports = {
  plugins: [
    require("@fullhuman/postcss-purgecss")({
      content: ["./index.html", "./js/**/*.js"],
      defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
    }),
  ],
};
