import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
// 1. Importe o plugin que instalamos
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  {
    // 2. Registre o plugin no novo formato Flat Config
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Garante apenas 1 linha após imports
      'import/newline-after-import': ['error', { count: 1 }],

      // Evita linhas extras entre imports
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
      ],

      // Desliga a regra padrão do TS para não dar conflito
      '@typescript-eslint/no-unused-vars': 'off',
      // No Next.js puro, as vezes a regra padrão se chama apenas no-unused-vars
      'no-unused-vars': 'off',

      // Liga a regra de apagar imports inúteis (o --fix vai deletar as linhas)
      'unused-imports/no-unused-imports': 'error',

      // Liga a regra de apagar variáveis/funções inúteis
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_', // Ignora se começar com underline (ex: _req)
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },

  ...nextVitals,
  ...nextTs,

  // Override de regras do React Compiler — deve vir DEPOIS dos spreads do Next.js
  {
    rules: {
      // Desliga o aviso sobre bibliotecas incompatíveis com o React Compiler
      'react-compiler/react-compiler': 'off',
      'react-hooks/incompatible-library': 'off',
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
