import * as Demos from '@tamagui/demos'
import { createParam } from 'solito'
import { H1, Spacer, YStack } from 'tamagui'

const { useParam } = createParam<{ id: string }>()

const nameMap = {
  Inputs: 'Inputs',
}

const NativeDemos = {
  ...Demos,
  // DrawerDemo,
  // no children
  AnimationsDemo: (props) => (
    <>
      <Demos.AnimationsDemo {...props}>
        <></>
      </Demos.AnimationsDemo>
      <Spacer />
    </>
  ),

  AnimatePresenceDemo: (props) => {
    return (
      <Demos.AnimationsEnterDemo>
        <></>
      </Demos.AnimationsEnterDemo>
    )
  },

  ThemesDemo: () => {
    return (
      <YStack gap="$4">
        <Demos.AddThemeDemo />
        <Demos.UpdateThemeDemo />
      </YStack>
    )
  },
}

export function DemoScreen() {
  const [id] = useParam('id')
  const name = id!
    .split('-')
    .map((segment) => {
      return segment[0].toUpperCase() + segment.slice(1)
    })
    .join('')

  const demoName = `${nameMap[name] || name}Demo`
  const DemoComponent = NativeDemos[demoName] ?? NotFound

  return (
    <YStack
      outlineStyle="solid"
      outlineColor="red"
      outlineWidth="$2"
      flex={1}
      justify="center"
      items="center"
      bg="$background"
      gap="$4"
      p="$4"
    >
      <DemoComponent />
    </YStack>
  )
}

const NotFound = () => <H1>Not found!</H1>
