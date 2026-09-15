// The control row that sits above a code block: the string/typed syntax toggle
// on the left, copy on the right. Both read as plain text until you hover them,
// where a soft background fades in behind. They share one height and one text
// treatment from here so the two line up exactly, which they could not when the
// toggle floated at `t={24} r={86}` and copy floated at `t=3 r=3`.
import { createContext, type ReactNode, useContext, useMemo, useState } from 'react'
import { SizableText, XStack } from 'tamagui'

/** row height, and therefore the height of every control in it */
export const CODE_CHROME_HEIGHT = 24

/** each syntax tab is fixed width so the active indicator can slide by 100% */
export const CODE_CHROME_TAB_WIDTH = 58

// copy lives inside DocCodeBlock but has to render in the toggle's row, which is
// a sibling above it. rather than pass a node up, the block publishes the text
// it would copy and the row renders its own button from that.
type CodeChromeSlot = {
  copyText: string | null
  setCopyText: (text: string | null) => void
}

const CodeChromeSlotContext = createContext<CodeChromeSlot | null>(null)

export function CodeChromeSlotProvider({ children }: { children: ReactNode }) {
  const [copyText, setCopyText] = useState<string | null>(null)
  const value = useMemo(() => ({ copyText, setCopyText }), [copyText])
  return (
    <CodeChromeSlotContext.Provider value={value}>
      {children}
    </CodeChromeSlotContext.Provider>
  )
}

export function useCodeChromeSlot() {
  return useContext(CodeChromeSlotContext)
}

export function CodeChromeRow({ children, ...props }: any) {
  return (
    <XStack
      items="center"
      justify="space-between"
      height={CODE_CHROME_HEIGHT}
      minH={CODE_CHROME_HEIGHT}
      // just enough room above the block to breathe, far less than the 36px
      // spacer this replaces
      mb="1"
      {...props}
    >
      {children}
    </XStack>
  )
}

/**
 * A control that reads as text. The background is what animates: transparent at
 * rest, a soft token on hover, so nothing draws a border or a button shape.
 */
export function CodeChromeButton({
  children,
  onPress,
  label,
  active,
  width,
}: {
  children: ReactNode
  onPress?: () => void
  label?: string
  active?: boolean
  width?: number
}) {
  const group = 'codechrome'
  return (
    <XStack
      group={group as any}
      render="button"
      aria-label={label}
      onPress={onPress}
      items="center"
      justify="center"
      gap="1"
      height={CODE_CHROME_HEIGHT}
      minH={CODE_CHROME_HEIGHT}
      px="2"
      {...(width ? { width } : null)}
      rounded="3"
      borderWidth={0}
      bg="transparent hover:color-3"
      transition="quickest"
      cursor="pointer"
      outlineColor="focus-visible:outline-color"
      outlineWidth="focus-visible:2px"
      outlineStyle="focus-visible:solid"
    >
      <CodeChromeText active={active}>{children}</CodeChromeText>
    </XStack>
  )
}

/**
 * Soft by default so the row never competes with the code, stronger on hover,
 * strongest when it is the active syntax.
 */
export function CodeChromeText({
  children,
  active,
}: {
  children: ReactNode
  active?: boolean
}) {
  return (
    <SizableText
      size="2"
      userSelect="none"
      transition="quickest"
      color={active ? 'color-12' : 'color-7 group-hover/codechrome:color-11'}
    >
      {children}
    </SizableText>
  )
}
