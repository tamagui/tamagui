import { ChevronDown } from '~/components/icons'
import * as React from 'react'
import {
  Adapt,
  Popover,
  type PopoverProps,
  Sheet,
  SizableText,
  View,
  XStack,
} from 'tamagui'
import { useSiteMode } from './useSiteMode'

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
        <Sheet zIndex={100000000} modal dismissOnSnapToBottom transition="medium">
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
        <Popover.Arrow
          size={10}
          borderWidth={1}
          borderColor="border-color"
          bg="background"
        />

        <XStack p="2" gap="1-5" items="center">
          <ModeSelect
            value={version}
            onValueChange={setVersion}
            options={[
              { value: 'v3', label: 'v3' },
              { value: 'v2', label: 'v2' },
            ]}
            aria-label="Version"
          />
          <ModeSelect
            value={styling}
            onValueChange={setStyling}
            options={[
              { value: 'tamagui', label: 'Tamagui' },
              { value: 'tailwind', label: 'Tailwind' },
            ]}
            disabled={version === 'v2'}
            aria-label="Styling"
          />
          {styling === 'tamagui' && (
            <ModeSelect
              value={syntax}
              onValueChange={setSyntax}
              options={[
                { value: 'string', label: 'String' },
                { value: 'object', label: 'Object' },
              ]}
              aria-label="Syntax"
            />
          )}
          <ModeSelect
            value={activeTheme ? String(activeTheme.id) : 'default'}
            onValueChange={setTheme}
            options={[
              { value: 'default', label: 'Default' },
              ...freeThemes.map((t) => ({ value: String(t.id), label: t.label })),
            ]}
            dotColor={activeTheme?.accentColor}
            aria-label="Theme"
          />
        </XStack>
      </Popover.Content>
    </Popover>
  )
}

// the selected option is the label; a transparent native select on top does the picking
function ModeSelect<T extends string>({
  value,
  onValueChange,
  options,
  dotColor,
  disabled,
  'aria-label': ariaLabel,
}: {
  value: T
  onValueChange: (val: T) => void
  options: { value: T; label: string }[]
  dotColor?: string
  disabled?: boolean
  'aria-label': string
}) {
  const label = options.find((o) => o.value === value)?.label ?? value

  return (
    <XStack
      position="relative"
      items="center"
      height={28}
      px="2"
      gap="1-5"
      rounded="4"
      bg="color-2 hover:color-3"
      opacity={disabled ? 0.35 : 1}
      pointerEvents={disabled ? 'none' : 'auto'}
      transition="all 120ms ease"
    >
      {dotColor && (
        <View width={7} height={7} rounded="10" backgroundColor={dotColor as any} />
      )}
      <SizableText size="1" color="color-12" userSelect="none" whiteSpace="nowrap">
        {label}
      </SizableText>
      <ChevronDown size={10} color="color-9" />
      <select
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onValueChange(e.target.value as T)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
          appearance: 'none',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </XStack>
  )
}
