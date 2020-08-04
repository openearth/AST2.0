module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [

    'plugin:vue/recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    'object-curly-spacing': [2, 'always'],
    'comma-dangle': [2, 'always-multiline'],
    'no-unused-vars': [
      'warn',
      {
        'ignoreRestSiblings': true,
        'argsIgnorePattern': '^_'
      }
    ],
    'vue/max-attributes-per-line': [2, {
      "singleline": 2,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }]
  }
}
