import { createRequire } from 'node:module'

export const requireResolve =
  'url' in import.meta ? createRequire(import.meta.url).resolve : require.resolve
