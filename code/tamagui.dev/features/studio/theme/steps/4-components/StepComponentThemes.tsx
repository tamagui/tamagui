import { useStoreSelector } from '@tamagui/use-store'
import { memo, useEffect } from 'react'
import {
  Button,
  H4,
  Label,
  ScrollView,
  Separator,
  SizableText,
  XStack,
  YGroup,
  YStack,
} from 'tamagui'

import { Select } from '../../../../../components/Select'
import {
  ThemeBuilderStore,
  themeBuilderStore,
  useThemeBuilderStore,
} from '~/features/studio/theme/store/ThemeBuilderStore'
import { AddDropdown } from '../../views/AddDropdown'
import { Stage, StageButtonBar, useSteps } from '../views/Stage'
// import { ThemeBuilderPalettesPane } from '../views/ThemeBuilderPalettesPane'
// import type { PreviewComponent } from './components'
import { components } from './components'

const useComponentThemesSteps = () => {
  return useSteps({ id: 'step-component-themes', total: 2, initial: 1 })
}

export const StepComponentThemes = memo(() => {
  const store = useThemeBuilderStore()
  const steps = useComponentThemesSteps()
  const componentThemes = Object.entries(store.componentThemes)
  const { selectedComponentTheme = '' } = store

  // ensure first is always selected
  useEffect(() => {
    // timeout prevents the bug where we're left with a selected, but not applies theme
    const timeoutId = setTimeout(() => {
      if (componentThemes.length > 0 && !store.selectedComponentTheme) {
        const id = componentThemes[0][0]
        store.setSelectedComponentTheme(id)
      }
    }, 500)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [componentThemes.length, store.selectedComponentTheme])

  return (
    <YStack mx="$-5" flex={1}>
      <XStack
        pointerEvents="auto"
        z={100}
        px="$4"
        py="$2"
        items="center"
        justify="space-between"
      >
        <H4 fontFamily="$mono" size="$5">
          Component: {selectedComponentTheme?.replace('Preview', '')}
        </H4>
        <SelectComponentTheme />
      </XStack>
      <Separator />
      <StageButtonBar steps={steps} />
      <Stage
        current={steps.index}
        steps={[<YStack key="palettes" />, <Themes key="themes" />]}
      />
    </YStack>
  )
})

const SelectComponentTheme = () => {
  // const store = useThemeBuilderStore()
  // const selected = store.selectedComponentTheme

  return (
    <XStack items="center" gap="$3">
      <Label fontFamily="$mono">Theme:</Label>
      <Select size="$3" value="ok" width={200}>
        <Select.Item index={0} value="" />
      </Select>
    </XStack>
  )
}

export const Themes = memo(() => {
  // const store = useThemeBuilderStore()

  return (
    <YStack gap="$4" py="$4" px="$2">
      {[]
        // .sort((a, b) => (a.id === store.selectedComponentTheme ? -1 : 1))
        .map(() => {
          return null
          // const handleUpdate = (next) => {
          //   store.updateComponentTheme({
          //     ...theme,
          //     ...next,
          //   })
          // }

          // const handleDelete = () => {
          //   store.deleteComponentTheme(theme)
          // }

          // return (
          //   <BuildThemeItem
          //     key={theme.id}
          //     isActive={store.selectedComponentTheme === theme.id}
          //     enableEditLabel
          //     label={theme.name}
          //     theme={theme}
          //     onUpdate={handleUpdate}
          //     onDelete={handleDelete}
          //     onPress={() => {
          //       store.setSelectedComponentTheme(theme.id)
          //     }}
          //   />
          // )
        })}
    </YStack>
  )
})

export function StepComponentThemesActions() {
  const store = useThemeBuilderStore()
  const show = store.showAddThemeMenu
  const setShow = (val: boolean) => (store.showAddThemeMenu = val)

  return (
    <XStack items="center" gap="$4">
      <AddDropdown open={show} onOpenChange={setShow}>
        <YGroup>
          <AddDropdown.Title>Palette Themes</AddDropdown.Title>
          {[].map(
            () => null
            // <AddDropdown.Item
            //   size="$3"
            //   key={theme.name}
            //   onPress={() => {
            //     store.addPalette(palette)
            //     store.addComponentTheme(theme)
            //     setShow(false)
            //   }}
            //   iconAfter={<ColorThemeIndicator size={10} theme={theme} />}
            //   title={theme.name}
            // />
          )}

          <AddDropdown.Separator />
        </YGroup>
      </AddDropdown>
    </XStack>
  )
}

export const StepComponentThemesPreview = () => {
  return (
    <YStack mt="$-8" gap="$5">
      <SelectParentTheme />
      <PreviewGrid />
    </YStack>
  )
}

const PreviewGrid = memo(() => {
  return (
    <XStack
      gap="$4"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(350px, 1fr))`,
      }}
    >
      {Object.keys(components).map((name) => {
        return <ThemeBuilderComponentCard key={name} name={name} />
      })}
    </XStack>
  )
})

const SelectParentTheme = () => {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$4">
      <Label>Parent Theme:</Label>
      <Select
        size="$3"
        width={200}
        value="base"
        onValueChange={(val) => {
          store.componentParentTheme = val
        }}
      >
        <Select.Item index={0} value="base">
          Light/Dark
        </Select.Item>

        <Select.Item index={1} value="accent" disabled={!store.baseTheme.accent}>
          Accent
        </Select.Item>
      </Select>
    </XStack>
  )
}

const ThemeBuilderComponentCard = memo(({ name }: { name: string }) => {
  const component = components.find((c) => c.name === name)
  const Preview = component?.component || (() => null)
  const parts: any[] = []
  const isActive = useStoreSelector(
    ThemeBuilderStore,
    (x) => x.selectedComponentTheme === name
  )

  return (
    <YStack
      key={name}
      flex={1}
      minW={300}
      height={400}
      overflow="hidden"
      elevation="$0.5"
      rounded="$4"
      borderWidth={1}
      borderColor="$borderColor"
      {...(isActive && {
        outlineColor: 'blue',
        outlineWidth: 2,
        outlineStyle: 'solid',
      })}
      onPress={() => {
        if (!isActive) {
          themeBuilderStore.setSelectedComponentTheme(name)
        }
      }}
    >
      <XStack position="absolute" t={0} l={0} r={0} items="center" justify="center">
        <SizableText size="$5" py="$3" fontWeight="600">
          {name.replace('Preview', '')}
        </SizableText>
      </XStack>

      <YStack flex={1} items="center" justify="center">
        <Preview />
      </YStack>

      <YStack
        bg="$color2"
        py="$2"
        position="absolute"
        b={0}
        l={0}
        r={0}
        items="center"
        justify="center"
      >
        <SizableText size="$3" color="$color9">{`${parts.length} theme${
          parts.length === 1 ? '' : 's'
        }:`}</SizableText>

        <XStack maxW="100%" overflow="hidden">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack items="center" justify="center" gap="$2" px="$4" py="$2">
              {parts.map((part: any) => {
                return (
                  <YStack key={part.name}>
                    <Button size="$3">{part.name}</Button>
                  </YStack>
                )
              })}
            </XStack>
          </ScrollView>
        </XStack>
      </YStack>
    </YStack>
  )
})
