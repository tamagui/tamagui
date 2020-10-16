process.env.IS_STATIC = 'true'

const all = require('./dist')
Object.assign(exports, all)
