process.env.SNACKUI_COMPILE_PROCESS = 1
process.env.IS_STATIC = 'is_static'
const all = require('./dist/static')
process.env.IS_STATIC = undefined
Object.assign(exports, all)
