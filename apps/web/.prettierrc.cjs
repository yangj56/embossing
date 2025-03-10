module.exports = {
  ...require("@repo/eslint-config/prettier"),
  plugins: [require("prettier-plugin-tailwindcss")],
  tailwindConfig: "./tailwind.config.js",
};

