import { useStore, useStoreSelector } from '@tamagui/use-store'
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

import { Select } from '../../../components/Select'
import {
  ThemeBuilderStore,
  themeBuilderStore,
  useThemeBuilderStore,
} from '~/features/studio/theme/store/ThemeBuilderStore'
import { AddDropdown } from '../../views/AddDropdown'
import { Stage, StageButtonBar, useSteps } from '../views/Stage'
import { ThemeBuilderPalettesPane } from '../views/ThemeBuilderPalettesPane'
import type { PreviewComponent } from './components'
import { components } from './components'

const useComponentThemesSteps = () => {
  return useSteps({ id: 'step-component-themes', total: 2, initial: 1 })
}

export const StepComponentThemes = memo(() => {
  const store = useThemeBuilderStore()
  const steps = useComponentThemesSteps()
  const componentThemes = Object.entries(store.componentThemes)
  const { selectedComponentTheme = '' } = store

  // // ensure first is always selected
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
    <YStack
      mx="$-5"
      f={1}
    >
      <XStack
        pe="auto"
        zi={100}
        px="$4"
        py="$2"
        ai="center"
        jc="space-between"
      >
        <H4
          ff="$mono"
          size="$5"
        >
          Component: {selectedComponentTheme?.replace('Preview', '')}
        </H4>
        <SelectComponentTheme />
      </XStack>
      <Separator />
      <StageButtonBar steps={steps} />
      <Stage
        current={steps.index}
        steps={[<ThemeBuilderPalettesPane key={0} />, <Themes key={1} />]}
      />
    </YStack>
  )
})

const SelectComponentTheme = () => {
  return (
    <XStack
      ai="center"
      gap="$3"
    >
      <Label ff="$mono">Theme:</Label>
      <Select
        size="$3"
        value="ok"
        w={200}
      >
        <Select.Item
          index={0}
          value=""
        />
      </Select>
    </XStack>
  )
}

export const Themes = memo(() => {
  return (
    <YStack
      gap="$4"
      py="$4"
      px="$2"
    >
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
    <XStack
      ai="center"
      space
    >
      <AddDropdown
        open={show}
        onOpenChange={setShow}
      >
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
    <YStack
      mt="$-8"
      gap="$5"
    >
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
        return (
          <ThemeBuilderComponentCard
            key={name}
            name={name}
          />
        )
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
        w={200}
        value="base"
        onValueChange={(val) => {
          store.componentParentTheme = val as any
        }}
      >
        <Select.Item
          index={0}
          value="base"
        >
          Light/Dark
        </Select.Item>

        <Select.Item
          index={1}
          value="accent"
          disabled={!store.baseTheme.accent}
        >
          Accent
        </Select.Item>
      </Select>
    </XStack>
  )
}

const ThemeBuilderComponentCard = memo(({ name }: { name: string }) => {
  const { Preview, parts } = components[name] as PreviewComponent
  const isActive = useStoreSelector(ThemeBuilderStore, (x) => x.selectedComponentTheme === name)

  return (
    <YStack
      key={name}
      f={1}
      miw={300}
      h={400}
      ov="hidden"
      elevation="$0.5"
      br="$4"
      bw={1}
      bc="$borderColor"
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
      <XStack
        pos="absolute"
        t={0}
        l={0}
        r={0}
        ai="center"
        jc="center"
      >
        <SizableText
          size="$5"
          py="$3"
          fow="600"
        >
          {name.replace('Preview', '')}
        </SizableText>
      </XStack>

      <YStack
        f={1}
        ai="center"
        jc="center"
      >
        <Preview />
      </YStack>

      <YStack
        bg="$color2"
        py="$2"
        pos="absolute"
        b={0}
        l={0}
        r={0}
        ai="center"
        jc="center"
      >
        <SizableText
          size="$3"
          theme="alt2"
        >{`${parts.length} theme${parts.length === 1 ? '' : 's'}:`}</SizableText>

        <XStack
          maw="100%"
          ov="hidden"
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <XStack
              ai="center"
              jc="center"
              gap="$2"
              px="$4"
              py="$2"
            >
              {parts.map((part) => {
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
