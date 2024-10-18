module.exports = {
  // Setting up and overriding some react-native CLI commands.
  // Necessary for building native iOS and Android apps,
  // where Vite shall be used instead of Metro for JS bundling during the build precess.
  commands: [...require('vxrn/react-native-commands')]
}
