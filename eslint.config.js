const parser = require('@typescript-eslint/parser');
const tsEslintPlugin = require('@typescript-eslint/eslint-plugin');
module.exports = [
  {
    ignores: [
      '.github/*',
      '.husky/*',
      'coverage/*',
      'data/*',
      'dist/*',
      'docs/*',
      'logs/*',
      'node_modules/*',
    ],
  },
  {
    name: 'ts/default',
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: parser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: '.',
      },
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      '@typescript-eslint/eslint-plugin': tsEslintPlugin,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
];
