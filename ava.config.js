module.exports = {
  extensions: ['ts', 'tsx'],
  require: [
    'ts-node/register/transpile-only',
    'esm',
    'tsconfig-paths/register',
  ],
  timeout: '30s',
  serial: true,
  failFast: false,
}
