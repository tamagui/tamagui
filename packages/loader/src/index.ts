// TODO this is being compiled below the export *
// just turn this into a cjs module only
process.env.TAMAGUI_TARGET = process.env.TAMAGUI_TARGET || 'web'
process.env.IS_STATIC = 'is_static'
process.env.TAMAGUI_IS_SERVER = 'true'

export * from './TamaguiPlugin'

export default require('./loader').loader

export * from './shouldExclude'
