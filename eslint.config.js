import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export default defineConfig([
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,

  {
    files: ['**/*.{js,jsx}'],
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
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      ...unicorn.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      'unicorn/no-array-reduce': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/prefer-query-selector': 'warn',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': [
        'warn',
        {
          cases: {
            camelCase: true,
          },
        },
      ],

      'prettier/prettier': ['error', { singleQuote: true }],
      quotes: 'off',

      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/label-has-text': 'off',
      'no-duplicate-imports': 'error',
      'jsx-a11y/interactive-supports-focus': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',

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
