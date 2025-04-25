/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  'rules': {
    "no-unused-parameter": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-parameter": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "ignoreRestSiblings": true,
        "args": "none"
      }
    ]
  },
  overrides: [
    {
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
        'cypress/support/**/*.{js,ts,jsx,tsx}'
      ],
      'extends': [
        'plugin:cypress/recommended'
      ]
    },
    {
      files: [
        '**/*.spec.{js,ts,jsx,tsx}'
      ],
      rules: {
        "@typescript-eslint/no-unused-parameter": "off",
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
