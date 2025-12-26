// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ["dist/*"],
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true, // always try to resolve types under <root>@types directory even it doesn't contain any source code
          project: "./tsconfig.json",
        },
      },
    },
  },
]);
