import { Moon } from '@tamagui/lucide-icons'
import { Button, ListItem, Text } from 'tamagui'

export function ButtonIconColor() {
  return (
    <>
      {/* Button with theme - icon should get the theme's color */}
      <Button
        testID="button-themed"
        theme="red"
        size="$3"
        icon={({ color, size }) => {
          return (
            <>
              <Text testID="icon-color-themed" opacity={0}>
                {String(color ?? 'undefined')}
              </Text>
              <Moon color={color} size={size} />
            </>
          )
        }}
      >
        Themed
      </Button>

      {/* Button with explicit color prop - icon should get that color */}
      <Button
        testID="button-explicit"
        size="$3"
        // @ts-expect-error color works at runtime via styled context but types don't expose it on Button directly
        color="$red10"
        icon={({ color, size }) => {
          return (
            <>
              <Text testID="icon-color-explicit" opacity={0}>
                {String(color ?? 'undefined')}
              </Text>
              <Moon color={color} size={size} />
            </>
          )
        }}
      >
        Explicit
      </Button>

      {/* Button with no theme or color - icon color should still resolve */}
      <Button
        testID="button-default"
        size="$3"
        icon={({ color, size }) => {
          return (
            <>
              <Text testID="icon-color-default" opacity={0}>
                {String(color ?? 'undefined')}
              </Text>
              <Moon color={color} size={size} />
            </>
          )
        }}
      >
        Default
      </Button>

      {/* ListItem with theme - icon should get the theme's color */}
      <ListItem
        testID="listitem-themed"
        theme="red"
        size="$3"
        icon={({ color, size }) => {
          return (
            <>
              <Text testID="listitem-icon-color-themed" opacity={0}>
                {String(color ?? 'undefined')}
              </Text>
              <Moon color={color} size={size} />
            </>
          )
        }}
      >
        ListItem Themed
      </ListItem>

      {/* ListItem with no theme - icon color should still resolve */}
      <ListItem
        testID="listitem-default"
        size="$3"
        icon={({ color, size }) => {
          return (
            <>
              <Text testID="listitem-icon-color-default" opacity={0}>
                {String(color ?? 'undefined')}
              </Text>
              <Moon color={color} size={size} />
            </>
          )
        }}
      >
        ListItem Default
      </ListItem>
    </>
  )
}
