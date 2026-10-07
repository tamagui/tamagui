import { Check, ChevronDown, ChevronRight } from '~/components/icons'
import * as React from 'react'
import {
  Menu,
  SizableText,
  styled,
  View,
  XStack,
} from 'tamagui'
import {
  useSiteMode,
  type SiteVersion,
  type SiteStyling,
  type SiteSyntax,
} from './useSiteMode'

const MenuItemTitle = styled(Menu.ItemTitle, {
  fontSize: 13,
  color: 'color-12',
  flex: 1,
  textAlign: 'left',
  userSelect: 'none',
})

const itemProps = {
  flexDirection: 'row',
  items: 'center',
  justifyContent: 'space-between',
  width: '100%',
  minHeight: 32,
  px: '2-5',
  py: '1-5',
  rounded: '3',
  cursor: 'pointer',
  bg: 'transparent hover:color-2 focus:color-3',
  gap: '3',
} as const

const contentProps = {
  minWidth: 175,
  bg: 'background',
  borderColor: 'border-color',
  borderWidth: 1,
  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.22)',
  p: '1-5',
  rounded: '4',
  gap: '0-5',
  transition: '100ms',
  scale: 'enter:0.96 exit:0.96',
  opacity: 'enter:0 exit:0',
} as const

export const SiteModePopover = () => {
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
    <Menu offset={10}>
      <Menu.Trigger asChild>
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
        >
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
      </Menu.Trigger>

      <Menu.Portal zIndex={100000}>
        <Menu.Content {...contentProps}>
          {/* Version Submenu */}
          <Menu.Sub>
            <Menu.SubTrigger {...itemProps}>
              <MenuItemTitle>Version</MenuItemTitle>
              <XStack items="center" gap="1-5">
                <SizableText size="1" color="color-10">
                  {version}
                </SizableText>
                <ChevronRight size={12} color="color-9" />
              </XStack>
            </Menu.SubTrigger>
            <Menu.Portal zIndex={100001}>
              <Menu.SubContent {...contentProps} minWidth={140}>
                <Menu.RadioGroup
                  value={version}
                  onValueChange={(val) => setVersion(val as SiteVersion)}
                >
                  <Menu.RadioItem value="v3" {...itemProps}>
                    <MenuItemTitle>v3</MenuItemTitle>
                    <Menu.ItemIndicator>
                      <Check size={12} color="color-11" />
                    </Menu.ItemIndicator>
                  </Menu.RadioItem>
                  <Menu.RadioItem value="v2" {...itemProps}>
                    <MenuItemTitle>v2</MenuItemTitle>
                    <Menu.ItemIndicator>
                      <Check size={12} color="color-11" />
                    </Menu.ItemIndicator>
                  </Menu.RadioItem>
                </Menu.RadioGroup>
              </Menu.SubContent>
            </Menu.Portal>
          </Menu.Sub>

          {/* Styling Submenu */}
          <Menu.Sub>
            <Menu.SubTrigger
              {...itemProps}
              disabled={version === 'v2'}
              opacity={version === 'v2' ? 0.4 : 1}
            >
              <MenuItemTitle>Styling</MenuItemTitle>
              <XStack items="center" gap="1-5">
                <SizableText size="1" color="color-10">
                  {styling === 'tailwind' ? 'Tailwind' : 'Tamagui'}
                </SizableText>
                <ChevronRight size={12} color="color-9" />
              </XStack>
            </Menu.SubTrigger>
            <Menu.Portal zIndex={100001}>
              <Menu.SubContent {...contentProps} minWidth={150}>
                <Menu.RadioGroup
                  value={styling}
                  onValueChange={(val) => setStyling(val as SiteStyling)}
                >
                  <Menu.RadioItem value="tamagui" {...itemProps}>
                    <MenuItemTitle>Tamagui</MenuItemTitle>
                    <Menu.ItemIndicator>
                      <Check size={12} color="color-11" />
                    </Menu.ItemIndicator>
                  </Menu.RadioItem>
                  <Menu.RadioItem value="tailwind" {...itemProps}>
                    <MenuItemTitle>Tailwind</MenuItemTitle>
                    <Menu.ItemIndicator>
                      <Check size={12} color="color-11" />
                    </Menu.ItemIndicator>
                  </Menu.RadioItem>
                </Menu.RadioGroup>
              </Menu.SubContent>
            </Menu.Portal>
          </Menu.Sub>

          {/* Syntax Submenu (only for Tamagui) */}
          {styling === 'tamagui' && (
            <Menu.Sub>
              <Menu.SubTrigger {...itemProps}>
                <MenuItemTitle>Syntax</MenuItemTitle>
                <XStack items="center" gap="1-5">
                  <SizableText size="1" color="color-10">
                    {syntax === 'object' ? 'Object' : 'String'}
                  </SizableText>
                  <ChevronRight size={12} color="color-9" />
                </XStack>
              </Menu.SubTrigger>
              <Menu.Portal zIndex={100001}>
                <Menu.SubContent {...contentProps} minWidth={140}>
                  <Menu.RadioGroup
                    value={syntax}
                    onValueChange={(val) => setSyntax(val as SiteSyntax)}
                  >
                    <Menu.RadioItem value="string" {...itemProps}>
                      <MenuItemTitle>String</MenuItemTitle>
                      <Menu.ItemIndicator>
                        <Check size={12} color="color-11" />
                      </Menu.ItemIndicator>
                    </Menu.RadioItem>
                    <Menu.RadioItem value="object" {...itemProps}>
                      <MenuItemTitle>Object</MenuItemTitle>
                      <Menu.ItemIndicator>
                        <Check size={12} color="color-11" />
                      </Menu.ItemIndicator>
                    </Menu.RadioItem>
                  </Menu.RadioGroup>
                </Menu.SubContent>
              </Menu.Portal>
            </Menu.Sub>
          )}

          {/* Separator before Theme */}
          <Menu.Separator height={1} my="1" bg="border-color" opacity={0.5} />

          {/* Theme Submenu */}
          <Menu.Sub>
            <Menu.SubTrigger {...itemProps}>
              <XStack items="center" gap="2" flex={1}>
                {activeTheme?.accentColor ? (
                  <View
                    width={7}
                    height={7}
                    rounded="10"
                    backgroundColor={activeTheme.accentColor as any}
                  />
                ) : null}
                <MenuItemTitle>Theme</MenuItemTitle>
              </XStack>
              <XStack items="center" gap="1-5">
                <SizableText size="1" color="color-10">
                  {activeTheme?.label ?? 'Default'}
                </SizableText>
                <ChevronRight size={12} color="color-9" />
              </XStack>
            </Menu.SubTrigger>
            <Menu.Portal zIndex={100001}>
              <Menu.SubContent {...contentProps} minWidth={170}>
                <Menu.RadioGroup
                  value={String(themeId)}
                  onValueChange={(val) => setTheme(val)}
                >
                  <Menu.RadioItem value="default" {...itemProps}>
                    <XStack items="center" gap="2" flex={1}>
                      <View width={7} height={7} />
                      <MenuItemTitle>Default</MenuItemTitle>
                    </XStack>
                    <Menu.ItemIndicator>
                      <Check size={12} color="color-11" />
                    </Menu.ItemIndicator>
                  </Menu.RadioItem>

                  {freeThemes.map((t) => (
                    <Menu.RadioItem
                      key={t.id}
                      value={String(t.id)}
                      {...itemProps}
                    >
                      <XStack items="center" gap="2" flex={1}>
                        <View
                          width={7}
                          height={7}
                          rounded="10"
                          backgroundColor={t.accentColor as any}
                        />
                        <MenuItemTitle>{t.label}</MenuItemTitle>
                      </XStack>
                      <Menu.ItemIndicator>
                        <Check size={12} color="color-11" />
                      </Menu.ItemIndicator>
                    </Menu.RadioItem>
                  ))}
                </Menu.RadioGroup>
              </Menu.SubContent>
            </Menu.Portal>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  )
}
