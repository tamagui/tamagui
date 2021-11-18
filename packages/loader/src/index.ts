process.env.TAMAGUI_TARGET = process.env.TAMAGUI_TARGET || 'web'
process.env.TAMAGUI_COMPILE_PROCESS = '1'

export default require('./loader').loader
