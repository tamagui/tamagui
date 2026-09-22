import { SizableText, Tabs } from 'tamagui'

type RovingTab = {
  value: string
  label: string
  href?: string
}

export function RovingTabs({
  ariaLabel,
  items,
  value,
  onValueChange,
  tabWidth,
  textSize = '2',
  testID,
}: {
  ariaLabel: string
  items: readonly RovingTab[]
  value: string
  onValueChange: (value: string) => void
  tabWidth?: number
  textSize?: '1' | '2'
  testID?: string
}) {
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value)
  )
  return (
    <Tabs
      activationMode="manual"
      orientation="horizontal"
      value={value}
      onValueChange={onValueChange}
      width={tabWidth ? tabWidth * items.length : '100%'}
    >
      <Tabs.List
        loop={false}
        aria-label={ariaLabel}
        testID={testID}
        position="relative"
        width="100%"
        gap={0}
        rounded="4"
      >
        <div
          style={{
            position: 'absolute',
            insetBlock: 0,
            left: 0,
            width: `${100 / items.length}%`,
            backgroundColor: 'var(--color-12)',
            borderRadius: 4,
            transform: `translateX(${activeIndex * 100}%)`,
            transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {items.map((item) => {
          const active = item.value === value
          return (
            <Tabs.Tab
              key={item.value}
              value={item.value}
              render={item.href ? 'a' : undefined}
              href={item.href}
              onPress={
                item.href
                  ? (event) => {
                      event.preventDefault()
                      onValueChange(item.value)
                    }
                  : () => onValueChange(item.value)
              }
              testID={testID ? `${testID}-${item.value}` : undefined}
              flex={tabWidth ? undefined : 1}
              width={tabWidth}
              px="2-5"
              py="1"
              items="center"
              justify="center"
              rounded="4"
              cursor="pointer"
              bg="transparent"
              zIndex={1}
            >
              <SizableText
                size={textSize}
                color={active ? 'color-1' : 'color-10'}
                transition="quickest"
              >
                {item.label}
              </SizableText>
            </Tabs.Tab>
          )
        })}
      </Tabs.List>
    </Tabs>
  )
}
