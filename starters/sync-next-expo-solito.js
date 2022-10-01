const { join } = require('path')

require('esbuild-register/dist/node').register()
process.env.TARGET = join(__dirname, './next-expo-solito')
require('./copy-latest-tamagui.ts')
