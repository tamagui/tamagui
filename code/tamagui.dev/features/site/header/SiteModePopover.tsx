import { Check, ChevronDown } from '@tamagui/local-icons'
import * as React from 'react'
import {
  Adapt,
  Paragraph,
  Popover,
  type PopoverProps,
  Separator,
  Sheet,
  SizableText,
  styled,
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

  // Get current active theme details
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
          height={30}
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
            size="2"
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

        <YStack width={310} maxWidth="calc(100vw - 32px)" p="3" gap="3" rounded="5">
          {/* Popover Header */}
          <XStack items="center" justify="space-between" pb="1" gap="2">
            <YStack flex={1} minWidth={0}>
              <Paragraph size="2" fontWeight="600" color="color-12">
                Site Preferences
              </Paragraph>
              <Paragraph size="1" color="color-9" numberOfLines={1} ellipsizeMode="tail">
                Customize docs & styling
              </Paragraph>
            </YStack>
            <XStack
              bg="color-3"
              px="2"
              py="1"
              rounded="3"
              items="center"
              justify="center"
              flexShrink={0}
            >
              <Paragraph size="1" fontFamily="mono" color="color-11">
                {shortForm}
              </Paragraph>
            </XStack>
          </XStack>

          <Separator opacity={0.6} />

          {/* 1. Version Choice */}
          <YStack gap="1-5">
            <XStack items="center" justify="space-between">
              <Paragraph size="1" fontWeight="600" color="color-10" textTransform="uppercase" letterSpacing={0.5}>
                Version
              </Paragraph>
              <Paragraph size="1" color="color-9">
                {version === 'v3' ? 'Latest v3' : 'Legacy v2'}
              </Paragraph>
            </XStack>

            <RovingSegment
              value={version}
              onValueChange={(val) => setVersion(val as SiteVersion)}
              items={[
                { value: 'v3', label: 'v3', hint: 'Tamagui 3.0' },
                { value: 'v2', label: 'v2', hint: 'Legacy 2.0' },
              ]}
            />
          </YStack>

          {/* 2. Styling Frontend Choice */}
          <YStack gap="1-5">
            <XStack items="center" justify="space-between">
              <Paragraph size="1" fontWeight="600" color="color-10" textTransform="uppercase" letterSpacing={0.5}>
                Styling
              </Paragraph>
              <Paragraph size="1" color="color-9">
                {styling === 'tailwind' ? 'Tailwind Classes' : 'Tamagui Style Props'}
              </Paragraph>
            </XStack>

            <RovingSegment
              value={styling}
              onValueChange={(val) => setStyling(val as SiteStyling)}
              items={[
                { value: 'tamagui', label: 'Tamagui', hint: 'Core style props' },
                {
                  value: 'tailwind',
                  label: 'Tailwind',
                  hint: version === 'v2' ? 'v3 only' : 'Classes frontend',
                  disabled: version === 'v2',
                },
              ]}
            />
          </YStack>

          {/* 3. Syntax Choice (Only for Tamagui mode) */}
          {styling === 'tamagui' && (
            <YStack gap="1-5">
              <XStack items="center" justify="space-between">
                <Paragraph size="1" fontWeight="600" color="color-10" textTransform="uppercase" letterSpacing={0.5}>
                  Syntax (Tamagui)
                </Paragraph>
                <Paragraph size="1" color="color-9">
                  {syntax === 'object' ? 'scale={{ hover: 1.1 }}' : 'scale="1 hover:1.1"'}
                </Paragraph>
              </XStack>

              <RovingSegment
                value={syntax}
                onValueChange={(val) => setSyntax(val as SiteSyntax)}
                items={[
                  { value: 'string', label: 'String', hint: 'String syntax' },
                  { value: 'object', label: 'Object', hint: 'Object syntax' },
                ]}
              />
            </YStack>
          )}

          <Separator opacity={0.6} />

          {/* 4. Site Theme Choice */}
          <YStack gap="2">
            <XStack items="center" justify="space-between">
              <Paragraph size="1" fontWeight="600" color="color-10" textTransform="uppercase" letterSpacing={0.5}>
                Site Theme
              </Paragraph>
              <Paragraph size="1" color="color-9">
                {activeTheme?.label || 'Default'}
              </Paragraph>
            </XStack>

            <XStack flexWrap="wrap" gap="1-5">
              {/* Default Theme Card */}
              <ThemeCard
                active={themeId === 'default' || !activeTheme}
                label="Default"
                accentColor="var(--color-12)"
                baseColor="var(--color-1)"
                onPress={() => setTheme('default')}
              />

              {/* Free Themes */}
              {freeThemes.map((theme) => {
                const isActive = String(themeId) === String(theme.id)
                return (
                  <ThemeCard
                    key={theme.id}
                    active={isActive}
                    label={theme.label}
                    accentColor={theme.accentColor}
                    baseColor={theme.baseColor}
                    onPress={() => setTheme(theme.id)}
                  />
                )
              })}
            </XStack>
          </YStack>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}

// Consistent Roving Segment Component matching Homepage roving tabs
function RovingSegment<T extends string>({
  value,
  onValueChange,
  items,
}: {
  value: T
  onValueChange: (val: T) => void
  items: { value: T; label: string; hint?: string; disabled?: boolean }[]
}) {
  return (
    <XStack
      role="tablist"
      gap={0}
      p="2px"
      rounded="4"
      borderWidth={1}
      borderColor="border-color"
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
            height={28}
            items="center"
            justify="center"
            rounded="3"
            cursor={isDisabled ? 'not-allowed' : 'pointer'}
            opacity={isDisabled ? 0.4 : 1}
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
              size="2"
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

// Theme Card with color swatches
function ThemeCard({
  active,
  label,
  accentColor,
  baseColor,
  onPress,
}: {
  active: boolean
  label: string
  accentColor: string
  baseColor: string
  onPress: () => void
}) {
  return (
    <XStack
      width="31%"
      flexGrow={1}
      height={32}
      items="center"
      gap="1-5"
      px="2"
      rounded="4"
      cursor="pointer"
      borderWidth={1}
      borderColor={active ? 'color-12' : 'border-color'}
      bg={active ? 'color-4' : 'color-2 hover:color-3'}
      transition="all 120ms ease"
      onPress={onPress}
    >
      {/* Palette indicator circles */}
      <XStack items="center" gap="-3px">
        <View
          width={12}
          height={12}
          rounded="10"
          backgroundColor={baseColor as any}
          borderWidth={1}
          borderColor="color-7"
          zIndex={1}
        />
        <View
          width={12}
          height={12}
          rounded="10"
          backgroundColor={accentColor as any}
          borderWidth={1}
          borderColor="color-7"
          zIndex={2}
        />
      </XStack>

      <Paragraph
        size="1"
        fontWeight={active ? '600' : '400'}
        color={active ? 'color-12' : 'color-11'}
        numberOfLines={1}
        ellipsizeMode="tail"
        flex={1}
      >
        {label}
      </Paragraph>

      {active && (
        <Check size={11} color="color-12" />
      )}
    </XStack>
  )
}
