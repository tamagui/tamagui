process.env.TARGET = process.env.TARGET || 'web'
process.env.SNACKUI_COMPILE_PROCESS = '1'

export default require('./loader').loader
