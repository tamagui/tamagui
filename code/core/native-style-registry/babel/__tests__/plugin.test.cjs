const babel = require('@babel/core')
const plugin = require('../index.cjs')

function transform(code, opts = {}) {
  const result = babel.transformSync(code, {
    plugins: [[plugin, opts]],
    presets: ['@babel/preset-react'],
    filename: 'test.tsx',
  })
  return result.code
}

describe('tamagui-style-registry babel plugin', () => {
  describe('inlineRCT mode (default)', () => {
    it('transforms View to createElement RCTView', () => {
      const input = `
        import React from 'react'
        import { View } from 'react-native'

        function App() {
          return <View style={{ flex: 1 }} />
        }
      `
      const output = transform(input)

      expect(output).toContain('createElement("RCTView"')
      expect(output).toContain('flex: 1')
      expect(output).not.toContain('<View')
    })

    it('transforms Text to createElement RCTText', () => {
      const input = `
        import React from 'react'
        import { Text } from 'react-native'

        function App() {
          return <Text>Hello</Text>
        }
      `
      const output = transform(input)

      expect(output).toContain('createElement("RCTText"')
      expect(output).toContain('"Hello"')
      expect(output).not.toContain('<Text')
    })

    it('handles nested View and Text', () => {
      const input = `
        import React from 'react'
        import { View, Text } from 'react-native'

        function App() {
          return (
            <View style={{ padding: 10 }}>
              <Text>Hello</Text>
            </View>
          )
        }
      `
      const output = transform(input)

      expect(output).toContain('createElement("RCTView"')
      expect(output).toContain('createElement("RCTText"')
      expect(output).toContain('padding: 10')
    })

    it('handles spread props', () => {
      const input = `
        import React from 'react'
        import { View } from 'react-native'

        function App(props) {
          return <View {...props} style={{ flex: 1 }} />
        }
      `
      const output = transform(input)

      expect(output).toContain('createElement("RCTView"')
      expect(output).toContain('...props')
    })

    it('handles ref prop', () => {
      const input = `
        import React, { useRef } from 'react'
        import { View } from 'react-native'

        function App() {
          const ref = useRef()
          return <View ref={ref} />
        }
      `
      const output = transform(input)

      expect(output).toContain('createElement("RCTView"')
      expect(output).toContain('ref:')
    })

    it('handles aliased imports', () => {
      const input = `
        import React from 'react'
        import { View as RNView } from 'react-native'

        function App() {
          return <RNView style={{ flex: 1 }} />
        }
      `
      const output = transform(input)

      expect(output).toContain('createElement("RCTView"')
      expect(output).not.toContain('<RNView')
    })

    it('does not transform non-RN components', () => {
      const input = `
        import React from 'react'
        import { View } from 'react-native'
        import { MyView } from './custom'

        function App() {
          return (
            <View>
              <MyView />
            </View>
          )
        }
      `
      const output = transform(input)

      expect(output).toContain('createElement("RCTView"')
      // MyView should remain as JSX (converted by react preset)
      expect(output).toContain('MyView')
    })

    it('adds React import if missing', () => {
      const input = `
        import { View } from 'react-native'

        function App() {
          return <View />
        }
      `
      const output = transform(input)

      expect(output).toContain('import _React from')
      expect(output).toContain('createElement("RCTView"')
    })

    it('skips node_modules by default', () => {
      const input = `
        import { View } from 'react-native'

        function App() {
          return <View />
        }
      `
      const result = babel.transformSync(input, {
        plugins: [[plugin, {}]],
        presets: ['@babel/preset-react'],
        filename: '/path/to/node_modules/some-lib/index.js',
      })

      // should not transform View->RCTView in node_modules
      expect(result.code).not.toContain('RCTView')
    })

    it('includes node_modules when opted in', () => {
      const input = `
        import { View } from 'react-native'

        function App() {
          return <View />
        }
      `
      const result = babel.transformSync(input, {
        plugins: [[plugin, { includeNodeModules: true }]],
        presets: ['@babel/preset-react'],
        filename: '/path/to/node_modules/some-lib/index.js',
      })

      expect(result.code).toContain('createElement("RCTView"')
    })
  })

  describe('wrapper mode (inlineRCT: false)', () => {
    it('swaps View import with wrapped component', () => {
      const input = `
        import { View, StyleSheet } from 'react-native'
      `
      const output = transform(input, { inlineRCT: false })

      expect(output).toContain('@tamagui/native-style-registry/components/View')
      expect(output).toContain('StyleSheet')
    })

    it('swaps multiple components', () => {
      const input = `
        import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
      `
      const output = transform(input, { inlineRCT: false })

      expect(output).toContain('@tamagui/native-style-registry/components/View')
      expect(output).toContain('@tamagui/native-style-registry/components/Text')
      expect(output).toContain(
        '@tamagui/native-style-registry/components/TouchableOpacity'
      )
      expect(output).toContain('StyleSheet')
    })

    it('preserves non-component imports', () => {
      const input = `
        import { View, Platform, Dimensions } from 'react-native'
      `
      const output = transform(input, { inlineRCT: false })

      expect(output).toContain('@tamagui/native-style-registry/components/View')
      expect(output).toContain('Platform')
      expect(output).toContain('Dimensions')
    })
  })
})
