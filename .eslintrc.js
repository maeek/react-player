module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:testing-library/react',
    'plugin:storybook/recommended'
  ],
  plugins: [ 'react', 'prettier', '@typescript-eslint' ],
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      legacyDecorators: true,
      jsx: true
    }
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: [ '.js', '.jsx', '.ts', '.tsx' ]
      },
      typescript: {}
    },
    react: {
      version: 'detect'
    }
  },
  rules: {
    semi: [ 'error', 'always' ],
    quotes: [ 'error', 'single' ],
    'no-console': [ 'error', {
      allow: [ 'warn', 'error' ]
    } ],
    'comma-dangle': [ 'error', 'never' ],
    indent: [ 'error', 2 ],
    'guard-for-in': 0,
    'no-param-reassign': 0,
    'react/require-default-props': 0,
    'jsx-quotes': 0,
    'react/prop-types': 0,
    'react/jsx-fragments': 0,
    'react/no-unused-prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'import/export': 0,
    'prettier/prettier': 0,
    'linebreak-style': 0,
    'no-multiple-empty-lines': [ 'error', {
      max: 1,
      maxEOF: 0
    } ],
    'eol-last': 2,
    'object-curly-spacing': [ 'error', 'always' ],
    'array-bracket-spacing': [ 'error', 'always' ],
    'computed-property-spacing': [ 'error', 'always' ],
    'quote-props': [ 'error', 'as-needed' ],
    'max-len': [ 'error', {
      code: 120,
      ignoreUrls: true
    } ],
    '@typescript-eslint/no-unused-vars': [ 2, {
      args: 'none'
    } ]
  }
};
