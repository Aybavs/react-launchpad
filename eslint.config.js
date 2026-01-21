import path from 'node:path'
import { fileURLToPath } from 'node:url'

import storybook from 'eslint-plugin-storybook'

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      '.storybook',
      'storybook-static',
      'test-*',
      'build',
      'coverage',
      'playwright-report',
      'test-results',
      '*.config.js',
      '*.config.ts',
      'public',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.app.json',
        },
        node: true,
      },
    },
    rules: {
      // React rules
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Import order
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'type',
          ],
          pathGroups: [
            { pattern: 'react', group: 'builtin', position: 'before' },
            { pattern: '@/**', group: 'internal', position: 'before' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Import boundaries - No cross-feature imports
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*'],
              message:
                'Do not import directly from feature internals. Use the feature barrel export (index.ts) instead.',
            },
          ],
        },
      ],

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  }, // Feature-specific rules to prevent cross-feature imports
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*'],
              message:
                'Features cannot import from other feature internals. Use core or shared instead.',
            },
            {
              group: ['@/app/*'],
              message: 'Features cannot import from app layer.',
            },
          ],
        },
      ],
    },
  }, // Core layer rules - no feature or app imports
  {
    files: ['src/core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/features/**'],
              message: 'Core cannot import from features.',
            },
            {
              group: ['@/app/*'],
              message: 'Core cannot import from app layer.',
            },
          ],
        },
      ],
    },
  }, // Shared layer rules - no other layer imports
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/features/**'],
              message: 'Shared cannot import from features.',
            },
            {
              group: ['@/core/*', '@/core/**'],
              message: 'Shared cannot import from core.',
            },
            {
              group: ['@/app/*'],
              message: 'Shared cannot import from app layer.',
            },
          ],
        },
      ],
    },
  },
  // Disable react-refresh/only-export-components for context files and files that export both components and utilities
  {
    files: [
      'src/**/context.tsx',
      'src/**/*Context.tsx',
      'src/core/ui/components/Toast.tsx',
      'src/core/ui/components/Breadcrumbs.tsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  // Allow console methods in monitoring and performance utilities
  {
    files: ['src/core/monitoring/**/*.ts', 'src/core/performance/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  // Test utilities can export both components and helpers
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/test/**/*.{ts,tsx}',
      '**/__tests__/**/*.{ts,tsx}',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  storybook.configs['flat/recommended']
)
