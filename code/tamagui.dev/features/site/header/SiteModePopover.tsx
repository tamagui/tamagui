import { ChevronDown } from '@tamagui/local-icons'
import * as React from 'react'
import {
  Adapt,
  Paragraph,
  Popover,
  type PopoverProps,
  Sheet,
  SizableText,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { useSiteMode, type SiteStyling, type SiteSyntax, type SiteVersion } from './useSiteMode'

export const SiteModePopover = (props: PopoverProps) => {
  const [open, setOpen] = React.useState(false)
  const {
    version,
    styling,
    syntax,
    themeId,
    shortForm,
    setVersion,
    setStyling,
    setSyntax,
    setTheme,
    freeThemes,
  } = useSiteMode()

  const activeTheme = freeThemes.find((t) => String(t.id) === String(themeId))

  return (
    <Popover
      disableRTL
      offset={12}
      open={open}
      onOpenChange={setOpen}
      hoverable={{
        delay: { open: 200, close: 150 },
        restMs: 150,
      }}
      {...props}
    >
      <Popover.Anchor asChild="except-style">
        <XStack
          role="button"
          tabIndex={0}
          aria-label="Site mode and preferences"
          data-testid="header-site-mode-button"
          rounded="10"
          px="2-5"
          height={32}
          items="center"
          gap="1-5"
          cursor="pointer"
          borderWidth={1}
          borderColor="border-color"
          bg="color-1 hover:color-2 press:color-3"
          transition="all 150ms ease"
          onPress={() => setOpen(!open)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setOpen(!open)
            }
          }}
        >
          {/* Active theme swatch dot if custom theme */}
          {activeTheme && (
            <XStack
              width={7}
              height={7}
              rounded="10"
              backgroundColor={activeTheme.accentColor as any}
              boxShadow={`0 0 4px ${activeTheme.accentColor}`}
            />
          )}

          <SizableText
            fontFamily="mono"
            size="1"
            color="color-12"
            letterSpacing={-0.3}
            userSelect="none"
          >
            {shortForm}
          </SizableText>

          <ChevronDown size={11} color="color-9" />
        </XStack>
      </Popover.Anchor>

      <Adapt platform="touch" when="sm">
        <Sheet
          zIndex={100000000}
          modal
          dismissOnSnapToBottom
          transition="medium"
        >
          <Sheet.Container>
            <Sheet.Background bg="background" />
            <Sheet.ScrollView showsVerticalScrollIndicator={false} p="4">
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Container>
          <Sheet.Overlay zIndex={100} bg="shadow-4" />
        </Sheet>
      </Adapt>

      <Popover.Content
        animatePosition
        transition="quick"
        bg="background"
        borderColor="border-color"
        borderWidth={1}
        boxShadow="0 16px 36px rgba(0, 0, 0, 0.22)"
        p={0}
        rounded="5"
        opacity="1 enter:0 exit:0"
        y="0 enter:-4px exit:-4px"
      >
        <Popover.Arrow size={10} borderWidth={1} borderColor="border-color" bg="background" />

        <YStack width={260} maxWidth="calc(100vw - 32px)" p="3" gap="2-5" rounded="5">
          {/* 1. Version Choice */}
          <YStack gap="1">
            <Paragraph size="1" color="color-9" fontWeight="600" textTransform="uppercase" letterSpacing={0.5}>
              Version
            </Paragraph>
            <RovingSegment
              value={version}
              onValueChange={(val) => setVersion(val as SiteVersion)}
              items={[
                { value: 'v3', label: 'v3' },
                { value: 'v2', label: 'v2' },
              ]}
            />
          </YStack>

          {/* 2. Styling Choice */}
          <YStack gap="1">
            <Paragraph size="1" color="color-9" fontWeight="600" textTransform="uppercase" letterSpacing={0.5}>
              Styling
            </Paragraph>
            <RovingSegment
              value={styling}
              onValueChange={(val) => setStyling(val as SiteStyling)}
              items={[
                { value: 'tamagui', label: 'Tamagui' },
                {
                  value: 'tailwind',
                  label: 'Tailwind',
                  disabled: version === 'v2',
                },
              ]}
            />
          </YStack>

          {/* 3. Syntax Choice (Only for Tamagui mode) */}
          {styling === 'tamagui' && (
            <YStack gap="1">
              <Paragraph size="1" color="color-9" fontWeight="600" textTransform="uppercase" letterSpacing={0.5}>
                Syntax
              </Paragraph>
              <RovingSegment
                value={syntax}
                onValueChange={(val) => setSyntax(val as SiteSyntax)}
                items={[
                  { value: 'string', label: 'String' },
                  { value: 'object', label: 'Object' },
                ]}
              />
            </YStack>
          )}

          {/* 4. Theme Choice */}
          <YStack gap="1-5">
            <Paragraph size="1" color="color-9" fontWeight="600" textTransform="uppercase" letterSpacing={0.5}>
              Theme
            </Paragraph>
            <XStack flexWrap="wrap" gap="1-5">
              <ThemePill
                active={themeId === 'default' || !activeTheme}
                label="Default"
                color="var(--color-12)"
                onPress={() => setTheme('default')}
              />
              {freeThemes.map((theme) => (
                <ThemePill
                  key={theme.id}
                  active={String(themeId) === String(theme.id)}
                  label={theme.label}
                  color={theme.accentColor}
                  onPress={() => setTheme(theme.id)}
                />
              ))}
            </XStack>
          </YStack>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}

function RovingSegment<T extends string>({
  value,
  onValueChange,
  items,
}: {
  value: T
  onValueChange: (val: T) => void
  items: { value: T; label: string; disabled?: boolean }[]
}) {
  return (
    <XStack
      role="tablist"
      gap={0}
      p="2px"
      rounded="4"
      bg="color-2"
      width="100%"
    >
      {items.map((item) => {
        const selected = item.value === value
        const isDisabled = item.disabled

        return (
          <XStack
            key={item.value}
            role="tab"
            aria-selected={selected}
            aria-disabled={isDisabled}
            tabIndex={selected ? 0 : -1}
            flex={1}
            height={26}
            items="center"
            justify="center"
            rounded="3"
            cursor={isDisabled ? 'not-allowed' : 'pointer'}
            opacity={isDisabled ? 0.35 : 1}
            bg={selected ? 'color-12' : 'transparent'}
            transition="all 150ms ease"
            onPress={() => {
              if (!isDisabled && !selected) {
                onValueChange(item.value)
              }
            }}
            onKeyDown={(e) => {
              if (isDisabled) return
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onValueChange(item.value)
              }
            }}
          >
            <Paragraph
              size="1"
              fontWeight={selected ? '600' : '400'}
              color={selected ? 'color-1' : 'color-11 hover:color-12'}
              userSelect="none"
              whiteSpace="nowrap"
            >
              {item.label}
            </Paragraph>
          </XStack>
        )
      })}
    </XStack>
  )
}

function ThemePill({
  active,
  label,
  color,
  onPress,
}: {
  active: boolean
  label: string
  color: string
  onPress: () => void
}) {
  return (
    <XStack
      items="center"
      gap="1-5"
      px="2"
      height={26}
      rounded="4"
      cursor="pointer"
      bg={active ? 'color-4' : 'color-2 hover:color-3'}
      transition="all 120ms ease"
      onPress={onPress}
    >
      <View
        width={7}
        height={7}
        rounded="10"
        backgroundColor={color as any}
      />
      <Paragraph
        size="1"
        fontWeight={active ? '600' : '400'}
        color={active ? 'color-12' : 'color-11'}
      >
        {label}
      </Paragraph>
    </XStack>
  )
}
