const React = require('react')

const defaultInsets = { top: 0, right: 0, bottom: 0, left: 0 }
const defaultFrame = { x: 0, y: 0, width: 0, height: 0 }

module.exports = {
  SafeAreaInsetsContext: React.createContext(null),
  SafeAreaFrameContext: React.createContext(null),
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => defaultInsets,
  useSafeAreaFrame: () => defaultFrame,
  initialWindowMetrics: {
    insets: defaultInsets,
    frame: defaultFrame,
  },
}
