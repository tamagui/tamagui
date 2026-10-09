import { createRequire } from 'node:module'
import proxy from './index.mjs'

const require = createRequire(import.meta.url)
const usePressability = (...args) => require('./pressability.js')(...args)
proxy.usePressability = usePressability

export * from './index.mjs'
export { usePressability }
export default proxy
