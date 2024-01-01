module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'src/test'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    'react-hooks',
    'react',
    'import',
    '@typescript-eslint',
    'jsx-a11y',
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    "react/react-in-jsx-scope": "off",
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.config.ts', '**/*.dev.ts'] }],
    'import/extensions': [
      'warn',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    'no-param-reassign': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};
