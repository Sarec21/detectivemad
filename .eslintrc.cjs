/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  rules: {
    // React 17+ no necesita el import de React en JSX:
    'react/react-in-jsx-scope': 'off',
    // Permite omitir extensiones al importar TS/TSX:
    'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }],
  },
  settings: {
    react: { version: 'detect' },
  },
};
