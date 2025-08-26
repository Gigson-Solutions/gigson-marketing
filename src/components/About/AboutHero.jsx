import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
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
      unicorn,
      prettier: prettierPlugin,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'unicorn/prefer-query-selector': 'warn',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': ['error', { case: 'camelCase' }],
      'prettier/prettier': 'error',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
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
