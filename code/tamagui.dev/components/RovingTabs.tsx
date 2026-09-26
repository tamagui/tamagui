// A tablist of real links with roving tabindex and manual activation.
//
// Used for docs syntax navigation (Styled / Source / Tailwind), where each tab
// is a route, not an in-place panel swap:
//   - every tab renders a real <a href>, so modified clicks (cmd/ctrl-click,
//     middle-click) keep native link behavior and the control works with no JS;
//   - plain left-clicks intercept into client-side navigation via onValueChange;
//   - arrow keys move focus only (manual activation); Enter/Space activates;
//   - the selected value + hrefs render from props alone (no window reads, no
//     effects, no portal), so SSR and hydration output is identical;
//   - tabs point at the content they switch via aria-controls (see panelId).
import { useRef } from 'react'
import { Paragraph, XStack } from 'tamagui'

export type RovingTabItem = {
  value: string
  label: string
  href: string
  title?: string
}

export function RovingTabs({
  ariaLabel,
  testID,
  items,
  value,
  onValueChange,
  textSize = '2',
  panelId,
}: {
  ariaLabel: string
  testID: string
  items: RovingTabItem[]
  value: string
  onValueChange: (value: string) => void
  textSize?: '1' | '2'
  panelId?: string
}) {
  const tabRefs = useRef<(HTMLElement | null)[]>([])

  const focusTab = (index: number) => {
    const count = items.length
    tabRefs.current[((index % count) + count) % count]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        focusTab(index + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        focusTab(index - 1)
        break
      case 'Home':
        event.preventDefault()
        focusTab(0)
        break
      case 'End':
        event.preventDefault()
        focusTab(items.length - 1)
        break
      case ' ':
        // links don't activate on Space; tabs must
        event.preventDefault()
        tabRefs.current[index]?.click()
        break
      default:
        break
    }
  }

  return (
    <XStack
      role="tablist"
      aria-label={ariaLabel}
      testID={testID}
      gap={0}
      p="2px"
      rounded="4"
      borderWidth={1}
      borderColor="border-color"
      bg="color-1"
      width="100%"
    >
      {items.map((item, index) => {
        const selected = item.value === value
        // spread: anchor-only props don't exist on the text prop type
        const anchorProps = { href: item.href, title: item.title }
        return (
          <Paragraph
            key={item.value}
            ref={(node) => {
              tabRefs.current[index] = node as unknown as HTMLElement | null
            }}
            render="a"
            role="tab"
            id={`${testID}-${item.value}-tab`}
            {...anchorProps}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            testID={`${testID}-${item.value}`}
            flex={1}
            px="3"
            height={28}
            minHeight={28}
            display="flex"
            items="center"
            justify="center"
            rounded="3"
            cursor="pointer"
            size={textSize}
            color={selected ? 'color-12' : 'color-11'}
            bg={selected ? 'color-4' : 'transparent'}
            outlineColor="focus-visible:outline-color"
            outlineWidth="focus-visible:2px"
            outlineStyle="focus-visible:solid"
            onKeyDown={(event) => onKeyDown(event, index)}
            onPress={(event: any) => {
              // modified clicks + non-left buttons keep native link behavior
              // (new tab, new window, context menu); only plain left-clicks
              // become client-side navigation.
              if (
                event.metaKey ||
                event.altKey ||
                event.ctrlKey ||
                event.shiftKey ||
                (event.button != null && event.button !== 0)
              ) {
                return
              }
              event.preventDefault()
              if (!selected) onValueChange(item.value)
            }}
          >
            {item.label}
          </Paragraph>
        )
      })}
    </XStack>
  )
}
