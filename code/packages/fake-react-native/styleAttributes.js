// react native's style attribute table, with no processors: the catch-all
// react-native/* alias would otherwise hand back this package's index, whose
// properties are not processor entries. tests that need a processor mock the
// table themselves
module.exports = {}
