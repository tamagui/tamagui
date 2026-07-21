import { useState } from 'react'
import type { ComponentProps, ComponentType } from 'react'
import { Text, View } from 'react-native'

type DesktopMouseViewProps = ComponentProps<typeof View> & {
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

// React Native macOS and Windows both extend the native View with these mouse
// events. The cast keeps the shared TypeScript project independent of either
// platform package's augmented ViewProps declaration.
const DesktopMouseView = View as ComponentType<DesktopMouseViewProps>

export function RawHoverProbe() {
  const [hovered, setHovered] = useState(false)
  const [enters, setEnters] = useState(0)
  const [leaves, setLeaves] = useState(0)

  return (
    <DesktopMouseView
      testID="raw-hover-probe"
      onMouseEnter={() => {
        setHovered(true)
        setEnters((count) => count + 1)
      }}
      onMouseLeave={() => {
        setHovered(false)
        setLeaves((count) => count + 1)
      }}
      style={{
        minHeight: 108,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: hovered ? '#0f766e' : '#99f6e4',
        backgroundColor: hovered ? '#0f766e' : '#ccfbf1',
        padding: 18,
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: hovered ? '#ffffff' : '#134e4a',
          fontSize: 16,
          fontWeight: '700',
        }}
      >
        {hovered
          ? 'Native View is hovered'
          : 'Move the pointer over this raw native View'}
      </Text>
      <Text
        style={{ color: hovered ? '#ccfbf1' : '#115e59', fontSize: 13, marginTop: 8 }}
      >
        mouseEnter {enters} · mouseLeave {leaves}
      </Text>
    </DesktopMouseView>
  )
}
