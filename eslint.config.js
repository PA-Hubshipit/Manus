import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * ESLint Configuration for Multi-AI Chat
 * =======================================
 * 
 * This configuration includes a custom rule to prevent arbitrary z-index usage.
 * All z-index values should come from the centralized z-index system.
 */

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        FormData: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
        AbortController: 'readonly',
        AbortSignal: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        EventTarget: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLSpanElement: 'readonly',
        HTMLAnchorElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLSelectElement: 'readonly',
        HTMLOptionElement: 'readonly',
        Element: 'readonly',
        Node: 'readonly',
        NodeList: 'readonly',
        MediaQueryList: 'readonly',
        MediaQueryListEvent: 'readonly',
        ResizeObserver: 'readonly',
        IntersectionObserver: 'readonly',
        MutationObserver: 'readonly',
        DOMRect: 'readonly',
        DOMRectReadOnly: 'readonly',
        globalThis: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react': react,
      'react-hooks': reactHooks,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off', // Use TypeScript's version instead
      
      // Custom z-index rule - warn on arbitrary z-index values
      'no-restricted-syntax': [
        'warn',
        {
          // Match z-[number] patterns in className strings
          selector: 'Literal[value=/z-\\[\\d+\\]/]',
          message: '⚠️ Arbitrary z-index detected! Use Z_CLASS from @/lib/z-index.ts instead. Valid layers: BELOW, BASE, ABOVE, ELEVATED, STICKY, FLOATING, DROPDOWN, POPOVER, MODAL_BACKDROP, MODAL, NESTED_MODAL, TOAST, CRITICAL',
        },
        {
          // Match z-50, z-100, etc. in className strings
          selector: 'Literal[value=/\\bz-(10|20|30|40|50|100|200|300|400|500|9999)\\b/]',
          message: '⚠️ Numeric z-index class detected! Use Z_CLASS from @/lib/z-index.ts instead. Valid layers: BELOW, BASE, ABOVE, ELEVATED, STICKY, FLOATING, DROPDOWN, POPOVER, MODAL_BACKDROP, MODAL, NESTED_MODAL, TOAST, CRITICAL',
        },
        {
          // Match zIndex in style objects with numeric values
          selector: 'Property[key.name="zIndex"][value.type="Literal"]',
          message: '⚠️ Inline zIndex detected! Use getZIndexStyle() from @/lib/z-index.ts instead.',
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    // Ignore patterns
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.git/**',
      '*.config.js',
      '*.config.ts',
      'drizzle/**',
    ],
  },
];
