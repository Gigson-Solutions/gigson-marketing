import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export default defineConfig([
  js.configs.recommended,
  react.configs.flat.recommended,

  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      unicorn,
      prettier: prettierPlugin,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    rules: {
      'import/order': 'off',
      'sort-imports': 'off',

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],

            ['^react$', '^@?\\w'],

            ['^(@|src)(/.*|$)'],

            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],

            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],

            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      'unicorn/prefer-query-selector': 'warn',
      'unicorn/prevent-abbreviations': 'off',

      'prettier/prettier': ['error', { singleQuote: true }],
      quotes: 'off',

      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',

      'import/no-unresolved': [
        'warn',
        { ignore: ['\\.(css|s[ac]ss)$', '\\.(png|jpe?g|svg|gif)$', '\\.jsx'] },
      ],
      'import/no-duplicates': 'error',

      semi: ['error', 'always'],

      'no-extra-semi': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-warning-comments': ['warn', { terms: [''], location: 'anywhere' }],
    },
    settings: { react: { version: 'detect' } },
  },
]);
