module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
  ],
  ignorePatterns: [ 'src/client/static/dato-plugins' ],
  // required to lint *.vue files
  plugins: [
    'vue',
  ],
  rules: {
    'object-curly-spacing': [2, 'always'],
    'comma-dangle': [2, 'always-multiline'],
    'no-unused-vars': [
      'warn',
      {
        'ignoreRestSiblings': true,
        'argsIgnorePattern': '^_',
      },
    ],
    'vue/max-attributes-per-line': [2, {
      'singleline': 2,
      'multiline': 1,
    }],
    'vue/multi-word-component-names': 'off',
    'vue/one-component-per-file': 'off',
    'vue/no-v-html': 'off',
    'vue/no-unused-components': 'warn',
    'no-debugger': 'off',
    'no-console': 'off',
    'no-prototype-builtins': 'off',
    'quotes': [ 'warn', 'single' ],
    'arrow-parens': ['warn', 'as-needed'],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'vue/one-component-per-file': 'error',
      }
    },
    {
      files: ['src/components/**/*.vue'],
      rules: {
        'vue/multi-word-component-names': 'error',
      }
    },
  ],
}
