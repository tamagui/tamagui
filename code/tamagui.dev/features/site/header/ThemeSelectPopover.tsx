import { Check, Paintbrush } from '~/components/icons'
import * as React from 'react'
import {
  Adapt,
  Popover,
  type PopoverProps,
  Sheet,
  SizableText,
  TooltipSimple,
  View,
  XStack,
  YStack,
} from 'tamagui'
import { useSiteMode } from './useSiteMode'

export const ThemeSelectPopover = (props: PopoverProps) => {
  const [open, setOpen] = React.useState(false)
  const { themeId, setTheme, freeThemes } = useSiteMode()

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
        <TooltipSimple groupId="header-actions-theme" label="Theme Palette">
          <XStack
            role="button"
            tabIndex={0}
            aria-label="Select theme palette"
            data-testid="header-theme-select-button"
            rounded="10"
            width={32}
            height={32}
            items="center"
            justify="center"
            cursor="pointer"
            position="relative"
            bg="transparent hover:rgba(0,0,0,0.15) active:rgba(0,0,0,0.2)"
            transition="all 150ms ease"
            onPress={() => setOpen(!open)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setOpen(!open)
              }
            }}
          >
            <Paintbrush size={15} color={activeTheme ? 'color-12' : 'color-11'} />

            {/* Active theme swatch dot if custom theme */}
            {activeTheme && (
              <XStack
                position="absolute"
                bottom={6}
                right={6}
                width={6}
                height={6}
                rounded="10"
                backgroundColor={activeTheme.accentColor as any}
                boxShadow={`0 0 3px ${activeTheme.accentColor}`}
              />
            )}
          </XStack>
        </TooltipSimple>
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
        p="2"
        minW={180}
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

        <YStack gap="1">
          <ThemeOption
            label="Default"
            selected={!activeTheme}
            onSelect={() => {
              setTheme('default')
              setOpen(false)
            }}
          />

          {freeThemes.map((theme) => {
            const isSelected = String(theme.id) === String(themeId)
            return (
              <ThemeOption
                key={theme.id}
                label={theme.label}
                accentColor={theme.accentColor}
                selected={isSelected}
                onSelect={() => {
                  setTheme(theme.id)
                  setOpen(false)
                }}
              />
            )
          })}
        </YStack>
      </Popover.Content>
    </Popover>
  )
}

function ThemeOption({
  label,
  accentColor,
  selected,
  onSelect,
}: {
  label: string
  accentColor?: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <XStack
      role="option"
      aria-selected={selected}
      cursor="pointer"
      py="1-5"
      px="2-5"
      rounded="4"
      items="center"
      justify="space-between"
      bg={selected ? 'color-3' : 'transparent hover:color-2'}
      transition="all 100ms ease"
      onPress={onSelect}
    >
      <XStack items="center" gap="2">
        {accentColor ? (
          <XStack
            width={8}
            height={8}
            rounded="10"
            backgroundColor={accentColor as any}
            boxShadow={`0 0 4px ${accentColor}`}
          />
        ) : (
          <View width={8} height={8} />
        )}
        <SizableText size="2" color="color-12" fontWeight={selected ? '600' : '400'}>
          {label}
        </SizableText>
      </XStack>

      {selected ? <Check size={12} color="color-11" /> : null}
    </XStack>
  )
}
