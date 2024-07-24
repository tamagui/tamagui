import { Plus } from '@tamagui/lucide-icons'
import { memo } from 'react'
import { Button, XStack, YGroup, YStack } from 'tamagui'

import { NoticeParagraph, StudioNotice } from '~/features/studio/StudioNotice'
import { defaultBaseTheme } from '~/features/studio/theme/constants/defaultBaseTheme'
import { defaultPalettes } from '../../constants/defaultPalettes'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import type { BuildTheme } from '../../types'
import { AddDropdown } from '../../views/AddDropdown'
import { BuildThemeItem } from '../views/BuildThemeItem'
import { BuildThemeItemFrame } from '../views/BuildThemeItemFrame'
import { PaletteView } from '../views/PaletteView'
import { Stage, StageButtonBar, useSteps } from '../views/Stage'

type StepBaseThemesProps = {
  previewMode?: boolean
}

const useBaseThemesSteps = () => {
  return useSteps({ id: 'step-base-themes', total: 2 })
}

export const StepBaseThemes = memo((_props: StepBaseThemesProps) => {
  return <Palettes key={0} />

  const steps = useBaseThemesSteps()

  return (
    <YStack mx="$-5" f={1}>
      <StageButtonBar steps={steps} />
      <Stage
        current={steps.index}
        // direction={steps.direction}
        steps={[
          //
          <Palettes key={0} />,
          //
          <Themes key={1} />,
        ]}
      />
    </YStack>
  )
})

const Palettes = memo(() => {
  const store = useThemeBuilderStore()

  return (
    <YStack gap="$3" py="$3" px="$2">
      {Object.entries(store.palettes).map(([name, palette]) => {
        return (
          <BuildThemeItemFrame
            key={name}
            label={name}
            {...(name !== 'base' && {
              onDelete: () => {
                store.deletePalette(name)
              },
            })}
          >
            <PaletteView
              onUpdate={(next) => {
                store.updatePalette(name, next)
              }}
              palette={palette}
            />
          </BuildThemeItemFrame>
        )
      })}
    </YStack>
  )
})

const Themes = memo(() => {
  const store = useThemeBuilderStore()
  const theme = store.baseTheme

  return (
    <YStack gap="$4" py="$4" px="$2">
      <BuildThemeItem
        label="light + dark"
        paletteNote="For now we automate a few things in palettes. We add transparencies to
        background/foreground, then attach an accent background and foreground."
        theme={theme}
        onUpdate={store.updateBaseTheme}
      />

      <BuildThemeItem
        label="accent"
        paletteNote="This is used for your Accent theme, which you can toggle on the top right of
          the preview sidebar."
        theme={
          theme.accent ||
          ({
            id: '',
            name: '',
            palette: '',
            template: '',
            type: 'theme',
          } satisfies BuildTheme)
        }
        onUpdate={async (next) =>
          await store.updateBaseTheme({
            accent: {
              ...store.baseTheme.accent,
              ...next,
            } as BuildTheme,
          })
        }
        disabled={!theme.accent}
        onDelete={store.deleteAccent}
        afterLabel={
          !theme.accent && (
            <Button
              icon={Plus}
              size="$2"
              br="$10"
              onPress={async () => {
                store.updateBaseTheme({
                  accent: defaultBaseTheme.accent,
                })
              }}
            >
              Add Accent
            </Button>
          )
        }
      />
    </YStack>
  )
})

export const StepBaseThemesTray = () => {
  return null
  // const store = useStore(StepBaseThemesStore)
  // return <ThemeTemplate theme={store.baseTheme} />
}

export const StepLightDarkTip = () => {
  return (
    <StudioNotice
      chromeless
      mih={320}
      miw={400}
      title="Base and Accent"
      steps={[
        // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
        <>
          <NoticeParagraph>
            This is a multi-step theme generator. This first step sets up your base theme
            and accent color - which then syncs to a separate accent theme, but it doesn't
            deal with component themes which for now are set to defaults, so if you don't
            like palette selections by the switch or button, you can customize those along
            with all the other components on step three.
          </NoticeParagraph>

          <NoticeParagraph>
            The base + accent setup is useful because lets you use a brand color or
            contrasting color for one-off cases with the default tokens set on your base
            theme ($accent, $accent1...12), but also lets you re-theme areas with that
            accent color.
          </NoticeParagraph>

          <NoticeParagraph>
            Note that using the light/dark mode toggle shows you the final result for each
            in the Theme tab.
          </NoticeParagraph>
        </>,

        // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
        <>
          <NoticeParagraph>
            We start you with a theme template that we find useful. Beyond the color steps
            from your palette ($color1 to $color12) it includes "generic" styles that
            Tamagui components will use ($background, $color, $colorHover...), as well as
            translucencies ($color0 and $background0 025 05 075).
          </NoticeParagraph>

          <NoticeParagraph>
            Since it's common to have an accent color and really theme to make areas "pop"
            we sync your Accent theme color here to a few base theme tokens ($accent and
            $accentBackground, $accent1 to 12). This way you can both &lt;Button
            theme="accent" /&gt; to change the whole look and feel of an area, or use the
            one-off accent as needed.
          </NoticeParagraph>
        </>,
      ]}
    />
  )
}

export const StepLightDarkPreviewThemes = () => {
  const store = useThemeBuilderStore()
  store.themeSuiteVersion
  return <StepBaseThemes previewMode key={store.themeSuiteVersion} />
}

export function StepBaseThemesActions() {
  const store = useThemeBuilderStore()
  const show = store.showAddThemeMenu
  const setShow = (val: boolean) => (store.showAddThemeMenu = val)
  const steps = useBaseThemesSteps()

  return (
    <XStack ai="center" space>
      <AddDropdown open={show} onOpenChange={setShow}>
        <YGroup>
          {steps.index === 0 && (
            <>
              <AddDropdown.Item
                size="$3"
                onPress={() => {
                  store.addPalette(defaultPalettes.accent)
                  setShow(false)
                }}
                title="Add Accent Palette"
              ></AddDropdown.Item>
            </>
          )}
        </YGroup>
      </AddDropdown>
    </XStack>
  )
}
