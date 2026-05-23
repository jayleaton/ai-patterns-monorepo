const path = require('path')
const { createRequire } = require('module')

const webAppRequire = createRequire(
  path.join(__dirname, 'apps/web-app/package.json')
)
const nextCoreWebVitals = webAppRequire('eslint-config-next/core-web-vitals')
const nextTypescript = webAppRequire('eslint-config-next/typescript')

module.exports = [
  {
    ignores: [
      '**/.next/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'warn',
      'no-var': 'warn',
      eqeqeq: 'warn',
      curly: 'off',
      'no-duplicate-imports': 'warn',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',
      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never' },
      ],
      'react/self-closing-comp': 'warn',
      'react/jsx-boolean-value': ['warn', 'never'],
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]
