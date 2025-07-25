import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'script' },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  // 🔧 Configuración extra para detectar versión de React
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
     rules: {
        "semi": ["error", "always"],
        "quotes": ["error", "single"],
        "no-extra-semi": "error",
        "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
        "react/self-closing-comp": "error", // autofixea <div></div> -> <div />
        "react/jsx-boolean-value": ["error", "never"], // autofixea props como <Component visible={true} />
        "react/jsx-curly-spacing": ["error", { "when": "never", "children": true }],
    }
  },
]);
