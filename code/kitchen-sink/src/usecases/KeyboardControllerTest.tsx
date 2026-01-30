/**
 * Direct test of keyboard-controller's KeyboardAvoidingView
 *
 * Tests if KeyboardAvoidingView provides smooth keyboard animation
 * without needing any special Sheet integration.
 */
import { useState } from 'react'
import { TextInput, View, Text, StyleSheet, Platform } from 'react-native'

// try to import keyboard-controller's KeyboardAvoidingView
let KeyboardAvoidingView: any
let KeyboardProvider: any
let useReanimatedKeyboardAnimation: any
let kbcAvailable = false

try {
  const rnkc = require('react-native-keyboard-controller')
  KeyboardAvoidingView = rnkc.KeyboardAvoidingView
  KeyboardProvider = rnkc.KeyboardProvider
  useReanimatedKeyboardAnimation = rnkc.useReanimatedKeyboardAnimation
  kbcAvailable = true
} catch {
  // keyboard-controller not available, use RN's built-in
  KeyboardAvoidingView = require('react-native').KeyboardAvoidingView
}

// component to show animated keyboard height (if reanimated hook available)
function KeyboardHeightDisplay() {
  if (!useReanimatedKeyboardAnimation) {
    return <Text style={styles.status}>useReanimatedKeyboardAnimation not available</Text>
  }

  try {
    const { height, progress } = useReanimatedKeyboardAnimation()
    // note: these are shared values, need Animated.Text to display
    return (
      <View style={styles.statusBox}>
        <Text style={styles.status}>Reanimated hook available ✓</Text>
        <Text style={styles.small}>(height/progress are Reanimated shared values)</Text>
      </View>
    )
  } catch (e: any) {
    return <Text style={styles.status}>Hook error: {e.message}</Text>
  }
}

function TestContent() {
  const [value, setValue] = useState('')

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>KeyboardController Test</Text>

        <Text style={[styles.status, { color: kbcAvailable ? 'green' : 'orange' }]}>
          keyboard-controller: {kbcAvailable ? '✓ installed' : '✗ not found'}
        </Text>

        <KeyboardHeightDisplay />

        <Text style={styles.instruction}>
          Tap the input below - watch if the content moves smoothly with the keyboard.
          {'\n\n'}
          With keyboard-controller, this should be butter smooth (60/120 FPS). Without it,
          you may see slight jank.
        </Text>

        <View style={styles.spacer} />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tap here to show keyboard..."
            value={value}
            onChangeText={setValue}
            testID="kbc-test-input"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export function KeyboardControllerTest() {
  // wrap in KeyboardProvider if available
  if (KeyboardProvider) {
    return (
      <KeyboardProvider>
        <TestContent />
      </KeyboardProvider>
    )
  }
  return <TestContent />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  status: {
    fontSize: 16,
    marginBottom: 8,
  },
  statusBox: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  small: {
    fontSize: 12,
    color: '#666',
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  spacer: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
  },
})
