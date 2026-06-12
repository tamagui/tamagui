const detoxGlobalSetup = require('detox/runners/jest/globalSetup')
const { buildCompilerFixturesForSelectedTests } = require('./compiler-fixtures')

module.exports = async (...args) => {
  buildCompilerFixturesForSelectedTests()
  return detoxGlobalSetup(...args)
}
