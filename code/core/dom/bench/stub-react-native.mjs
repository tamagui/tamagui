import { plugin } from 'bun'

/**
 * React Native cannot load outside a native runtime, and the benchmark does not
 * need it to: what is being measured is the cost of building the element, which
 * does not depend on what the host component is. Each stub is a distinct
 * function so element types stay distinguishable.
 */
plugin({
  name: 'stub-react-native',
  setup(build) {
    build.module('react-native', () => ({
      loader: 'js',
      contents: `
        export const View = function View() { return null }
        export const Text = function Text() { return null }
        export const Image = function Image() { return null }
        export const TextInput = function TextInput() { return null }
        export const Pressable = function Pressable() { return null }
      `,
    }))
  },
})
