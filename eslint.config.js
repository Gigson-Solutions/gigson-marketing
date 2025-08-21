// eslint.config.js
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
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
     
    },
    rules: {
      'import/order': 'off', 

 
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