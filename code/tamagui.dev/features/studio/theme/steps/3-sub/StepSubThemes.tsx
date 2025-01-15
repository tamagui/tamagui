import { memo, useEffect } from 'react'
import {
  Button,
  H4,
  H6,
  ListItem,
  Paragraph,
  Separator,
  SizableText,
  XStack,
  YGroup,
  YStack,
} from 'tamagui'

import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { NoticeParagraph, StudioNotice } from '../../../StudioNotice'
import { defaultBaseTheme } from '../../constants/defaultBaseTheme'
import { getUniqueId } from '../../helpers/getUniqueId'
import type { BuildPalette, BuildTheme } from '../../types'
import { AddDropdown } from '../../views/AddDropdown'
import { ColorThemeIndicator } from '../../views/ColorThemeIndicator'
import { BuildThemeItem } from '../views/BuildThemeItem'
import { Stage, StageButtonBar, useSteps } from '../views/Stage'
import { ThemeBuilderPalettesPane } from '../views/ThemeBuilderPalettesPane'

type StepSubThemesProps = {
  previewMode?: boolean
}

const useSubThemesSteps = () => {
  return useSteps({ id: 'step-sub-themes', total: 2, initial: 1 })
}

export const StepSubThemes = memo(({ previewMode }: StepSubThemesProps) => {
  const store = useThemeBuilderStore()
  const steps = useSubThemesSteps()

  // ensure first is always selected
  useEffect(() => {
    // timeout prevents the bug where we're left with a selected, but not applies theme
    const timeoutId = setTimeout(() => {
      if (store.subThemes.length > 0 && !store.selectedSubTheme) {
        const id = store.subThemes[0].id
        store.setSelectedSubTheme(id)
      }
    }, 500)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [store.subThemes.length, store.selectedSubTheme])

  useEffect(() => {
    if (!store.subThemes.length) {
      const tm = setTimeout(() => {
        store.showAddThemeMenu = true
      }, 500)
      return () => clearTimeout(tm)
    }
  }, [store.subThemes.length])

  return (
    <YStack mx="$-5" f={1}>
      <StageButtonBar steps={steps} />
      <Stage current={steps.index} steps={[<ThemeBuilderPalettesPane />, <Themes />]} />
    </YStack>
  )
})

export const Themes = memo(({ previewMode }: StepSubThemesProps) => {
  const store = useThemeBuilderStore()

  return (
    <YStack f={1} gap="$4" py="$4" px="$2">
      {store.subThemes
        // .sort((a, b) => (a.id === store.selectedSubTheme ? -1 : 1))
        .map((theme, index) => {
          const handleUpdate = (next) => {
            store.updateSubTheme({
              ...theme,
              ...next,
            })
          }

          const handleDelete = () => {
            store.deleteSubTheme(theme)
          }

          return (
            <BuildThemeItem
              key={theme.id}
              isActive={store.selectedSubTheme === theme.id}
              enableEditLabel
              label={theme.name}
              theme={theme}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onPress={() => {
                store.setSelectedSubTheme(theme.id)
              }}
            />
          )
        })}

      {!store.subThemes.length && (
        <YStack f={1} ai="center" jc="center" gap="$4">
          <Paragraph theme="alt1">Add a theme to get started</Paragraph>
          <Button
            themeInverse
            size="$4"
            onPress={() => {
              store.showAddThemeMenu = true
            }}
          >
            Add theme
          </Button>
        </YStack>
      )}
    </YStack>
  )
})

export function StepSubThemesActions() {
  const store = useThemeBuilderStore()
  const show = store.showAddThemeMenu
  const setShow = (val: boolean) => (store.showAddThemeMenu = val)

  return (
    <XStack ai="center" space>
      <AddDropdown open={show} onOpenChange={setShow}>
        <YGroup>
          <AddDropdown.Title>Palette Themes</AddDropdown.Title>

          {colorThemePresets.map(({ theme, palette }) => (
            <AddDropdown.Item
              size="$3"
              key={theme.name}
              onPress={() => {
                store.addPalette(palette)
                store.addSubTheme(theme)
                setShow(false)
              }}
              iconAfter={<ColorThemeIndicator size={10} primary={palette} />}
              title={theme.name}
            />
          ))}

          <AddDropdown.Separator />

          <H6 size="$1" pt="$2" px="$3" o={0.5}>
            Custom
          </H6>

          {/* <AddDropdown.Item
            size="$3"
            onPress={() => {
              store.addSubTheme({
                name: 'mymasktheme',
                type: 'mask',
                masks: [],
              })
              setShow(false)
            }}
            title="Mask Theme"
          ></AddDropdown.Item> */}

          <AddDropdown.Item
            size="$3"
            onPress={() => {
              store.addSubTheme(defaultBaseTheme)
              setShow(false)
            }}
            title="Palette Theme"
          ></AddDropdown.Item>
        </YGroup>
      </AddDropdown>
    </XStack>
  )
}

const colorThemePresets: { theme: BuildTheme; palette: BuildPalette }[] = [
  {
    theme: {
      id: getUniqueId(),
      name: 'success',
      template: 'base',
      type: 'theme',
      palette: 'green',
    },
    palette: {
      name: 'green',
      anchors: [
        {
          index: 0,
          hue: { sync: true, light: 153, dark: 153 },
          sat: { sync: true, light: 0.7, dark: 0.7 },
          lum: { light: 0.985, dark: 0.1 },
        },
        {
          index: 9,
          hue: { syncLeft: true, sync: true, light: 153, dark: 153 },
          sat: { syncLeft: true, sync: true, light: 0.7, dark: 0.7 },
          lum: { light: 0.5, dark: 0.5 },
        },
        {
          index: 10,
          hue: { sync: true, light: 153, dark: 153 },
          sat: { sync: true, light: 0.7, dark: 0.7 },
          lum: { light: 0.15, dark: 0.925 },
        },
        {
          index: 11,
          hue: { syncLeft: true, sync: true, light: 153, dark: 153 },
          sat: { syncLeft: true, sync: true, light: 0.7, dark: 0.7 },
          lum: { light: 0.1, dark: 0.95 },
        },
      ],
    },
  },

  {
    theme: {
      id: getUniqueId(),
      name: 'warning',
      template: 'base',
      type: 'theme',
      palette: 'yellow',
    },
    palette: {
      name: 'yellow',
      anchors: [
        {
          index: 0,
          hue: { sync: true, light: 48, dark: 48 },
          sat: { sync: true, light: 0.7, dark: 0.7 },
          lum: { light: 0.985, dark: 0.1 },
        },
        {
          index: 9,
          hue: { syncLeft: true, sync: true, light: 48, dark: 48 },
          sat: { syncLeft: true, sync: true, light: 0.7, dark: 0.7 },
          lum: { light: 0.5, dark: 0.5 },
        },
        {
          index: 10,
          hue: { sync: true, light: 48, dark: 48 },
          sat: { sync: true, light: 0.7, dark: 0.7 },
          lum: { light: 0.15, dark: 0.925 },
        },
        {
          index: 11,
          hue: { syncLeft: true, sync: true, light: 48, dark: 48 },
          sat: { syncLeft: true, sync: true, light: 0.7, dark: 0.7 },
          lum: { light: 0.1, dark: 0.95 },
        },
      ],
    },
  },

  {
    theme: {
      id: getUniqueId(),
      name: 'error',
      template: 'base',
      type: 'theme',
      palette: 'red',
    },
    palette: {
      name: 'red',
      anchors: [
        {
          index: 0,
          hue: { sync: true, light: 0, dark: 0 },
          sat: { sync: true, light: 0.7, dark: 0.7 },
          lum: { light: 0.985, dark: 0.1 },
        },
        {
          index: 9,
          hue: { syncLeft: true, sync: true, light: 0, dark: 0 },
          sat: { syncLeft: true, sync: true, light: 0.7, dark: 0.7 },
          lum: { light: 0.5, dark: 0.5 },
        },
        {
          index: 10,
          hue: { sync: true, light: 0, dark: 0 },
          sat: { sync: true, light: 0.7, dark: 0.7 },
          lum: { light: 0.15, dark: 0.925 },
        },
        {
          index: 11,
          hue: { syncLeft: true, sync: true, light: 0, dark: 0 },
          sat: { syncLeft: true, sync: true, light: 0.7, dark: 0.7 },
          lum: { light: 0.1, dark: 0.95 },
        },
      ],
    },
  },
]

export function BaseThemesStepPreviewThemes() {
  return <StepSubThemes previewMode />
}

export function BaseThemesStepPreview() {
  return (
    <YStack py="$4" gap="$4">
      <H4>Alright, thats our base and sub-themes&nbsp;&nbsp;🙌</H4>

      <Paragraph theme="alt1" size="$5">
        We've made the foundation of our theme suite.
      </Paragraph>

      <StudioNotice my="$3" title="Coming later...">
        <NoticeParagraph>
          You'll be able to customize <em>component themes</em> later, so don't worry if
          some specific components look a little off (like if you want brighter
          backgrounds on buttons).
        </NoticeParagraph>
      </StudioNotice>
    </YStack>
  )
}

export function BaseThemesStepPreview2() {
  const { baseTheme, subThemes, schemes: userSchemes, palettes } = useThemeBuilderStore()
  const schemes = Object.keys(userSchemes)
  const fullThemes = schemes.flatMap((scheme) => {
    return [
      {
        ...baseTheme,
        name: scheme || '?',
      },
      baseTheme.accent
        ? {
            ...baseTheme.accent,
            name: `${scheme}_${baseTheme.accent?.name}`,
          }
        : null,
      ...subThemes.map((theme) => {
        return {
          ...theme,
          name: `${scheme}_${theme.name}`,
        }
      }),
    ].filter(Boolean)
  })

  return (
    <YStack py="$4" gap="$3">
      <H4>The full list, so far:</H4>

      <Paragraph size="$5" theme="alt1">
        Congrats! That's the core of your theme suite.
      </Paragraph>

      <Paragraph size="$5" theme="alt1">
        In the future, we'll allow customizing component themes as well, but for now this
        gives you everything you need. You can of course manually override the component
        styles very easily inline.
      </Paragraph>

      <Paragraph size="$5" theme="alt1">
        We've now generated the following themes:
      </Paragraph>

      <YGroup
        separator={<Separator borderWidth={0.5} o={0.25} />}
        bw={1}
        bc="$borderColor"
        my="$2"
      >
        {fullThemes.map((theme) => {
          return (
            <ListItem
              key={theme?.name}
              title={theme?.name}
              iconAfter={
                theme?.type === 'theme' ? (
                  <ColorThemeIndicator
                    primary={palettes[theme.palette]}
                    secondary={palettes[theme.accent?.palette as any]}
                  />
                ) : (
                  <SizableText>Mask</SizableText>
                )
              }
            />
          )
        })}
      </YGroup>
    </YStack>
  )
}
