import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Plugins y reglas se comparten entre JS/JSX y TS/TSX. Antes solo existía el
// bloque `**/*.{js,jsx}`, así que los .ts/.tsx (186 de los 190 ficheros fuente)
// caían en `js.configs.recommended` con el parser por defecto (espree) y
// reventaban en "Parsing error" ante cualquier anotación de tipos.
const sharedPlugins = {
  'simple-import-sort': simpleImportSort,
  unicorn,
  prettier: prettierPlugin,
  'jsx-a11y': jsxA11y,
  // Ya estaban en devDependencies y el código los referencia en comentarios
  // `eslint-disable`, pero nunca se registraron: ESLint los reportaba como
  // "Definition for rule ... was not found".
  'react-hooks': reactHooks,
  'unused-imports': unusedImports,
  '@next/next': nextPlugin,
};

const sharedRules = {
  ...reactPlugin.configs.recommended.rules,
  ...prettierPlugin.configs.recommended.rules,
  ...unicorn.configs.recommended.rules,
  ...jsxA11y.configs.recommended.rules,
  ...reactHooks.configs.recommended.rules,
  ...nextPlugin.configs['core-web-vitals'].rules,

  'simple-import-sort/imports': 'error',
  'simple-import-sort/exports': 'error',

  'unicorn/no-array-reduce': 'off',
  // `null` es idiomático en React (retorno de componentes, valor inicial de refs)
  // y en las respuestas de Payload; forzar `undefined` iba contra todo el código.
  'unicorn/no-null': 'off',
  // Marcaba cada handler o helper definido dentro de un componente que no
  // captura nada del scope; sacarlos fuera rompe la colocación de React.
  'unicorn/consistent-function-scoping': 'off',

  // Las tres siguientes tienen autofix que rompe el type-check de este repo:
  //  - prefer-global-this: `window` lleva augmentaciones (`interface Window`
  //    con gtag/dataLayer) que no existen en `typeof globalThis` → TS7017.
  //  - prefer-native-coercion-functions: convierte
  //    `.filter((n): n is number => Boolean(n))` en `.filter(Boolean)` y se
  //    lleva por delante el type predicate → TS18048 en el reduce siguiente.
  //  - prefer-at: `groups[groups.length - 1]` → `groups.at(-1)` devuelve
  //    `T | undefined` → TS2532. El indexado original tampoco es estrictamente
  //    seguro; merece revisarse aparte, no via autofix.
  'unicorn/prefer-global-this': 'off',
  'unicorn/prefer-native-coercion-functions': 'off',
  'unicorn/prefer-at': 'off',

  // Reescriben control de flujo (cadenas if/else a switch, condiciones
  // invertidas) en sitios como la validación del estimador. Un refactor así
  // se decide y se prueba a mano, no lo aplica un pase de lint.
  'unicorn/prefer-switch': 'off',
  'unicorn/no-negated-condition': 'off',
  'unicorn/no-lonely-if': 'off',
  'unicorn/no-nested-ternary': 'off',
  'unicorn/no-useless-undefined': 'off',
  'unicorn/number-literal-case': 'off',
  'unicorn/prefer-query-selector': 'warn',
  'unicorn/prevent-abbreviations': 'off',
  'unicorn/filename-case': [
    'warn',
    {
      cases: {
        camelCase: true,
        // Los componentes del repo son PascalCase (Navbar.tsx, AboutHero.tsx):
        // solo con camelCase la regla marcaba 108 ficheros correctos.
        pascalCase: true,
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
  // jsx-a11y considera `<canvas>` interactivo y rechaza role="presentation",
  // pero en un canvas decorativo (las formas del design system) eso es
  // justo lo correcto junto con aria-hidden.
  'jsx-a11y/no-interactive-element-to-noninteractive-role': [
    'error',
    { canvas: ['img', 'presentation'] },
  ],

  // Regla del Pages Router: comprueba los href contra `pages/`, que este
  // proyecto no tiene (App Router). Marcaba como error un `<a>` a una API
  // route de OAuth, donde `next/link` sería incorrecto.
  '@next/next/no-html-link-for-pages': 'off',

  semi: ['error', 'always'],

  'no-extra-semi': 'error',
  'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  'unused-imports/no-unused-imports': 'error',
  'react/self-closing-comp': 'error',
  'react/jsx-boolean-value': ['error', 'never'],
  'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],
  'react/react-in-jsx-scope': 'off',
  'react/prop-types': 'off',
  // `terms: ['']` casaba con cualquier comentario del repo (904 avisos de ruido).
  // `location: 'start'` y no 'anywhere' porque los comentarios de este repo
  // están en castellano: con 'anywhere', la palabra "todo" marcaba frases
  // normales ("forzar undefined iba contra todo el código").
  'no-warning-comments': [
    'warn',
    { terms: ['todo', 'fixme', 'hack', 'xxx'], location: 'start' },
  ],
};

export default defineConfig([
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      // Generados por Payload: `importMap.js` por su build y `migrations/` por
      // `createMigration()`. Lintarlos solo crea churn — cada migración nueva
      // llegaría con el estilo de Payload y fallaría el lint — y reformatear
      // una migración ya aplicada en producción no aporta nada.
      'app/**/importMap.js',
      'migrations/**',
      '.next/**',
      '.vercel/**',
      '.turbo/**',
      'coverage/**',
      'build/**',
      'out/**',
      'next-env.d.ts',
    ],
  },
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,

  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: sharedPlugins,
    rules: sharedRules,
    settings: { react: { version: 'detect' } },
  },

  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { ...sharedPlugins, '@typescript-eslint': tseslint.plugin },
    rules: {
      ...sharedRules,

      // De esto ya se encarga el compilador de TypeScript, y con el parser de TS
      // las reglas base dan falsos positivos sobre tipos, interfaces y overloads.
      'no-undef': 'off',
      'no-redeclare': 'off',
      // La regla base no entiende `import type`: marcaba como duplicado el
      // patrón recomendado de TS (`import { x }` + `import type { T }` del
      // mismo módulo), y 6 de los 7 casos están en migraciones generadas por
      // el `createMigration()` de Payload, que no se editan a mano.
      'no-duplicate-imports': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
    settings: { react: { version: 'detect' } },
  },
  {
    // `scripts/` son CLI de Node que se invocan a mano o desde npm scripts:
    // `process.exit()` con código de salida es justo lo que se espera de ellos.
    files: ['scripts/**'],
    rules: {
      'unicorn/no-process-exit': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prefer-dom-node-text-content': 'off',
    },
  },
]);
