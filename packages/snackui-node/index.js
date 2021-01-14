process.env.IS_STATIC = 'true'
const all = require('./_')
process.env.IS_STATIC = undefined
Object.assign(exports, all)
