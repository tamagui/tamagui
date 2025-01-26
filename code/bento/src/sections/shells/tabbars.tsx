import { YStack } from 'tamagui'

// import { getCode } from '../../components/forms/switches'
import { Showcase } from '../../components/general/_Showcase'
import * as TabBars from '../../components/shells/tabbars'

type Props = ReturnType<typeof tabbarsGetComponentCodes>
export function tabbars(props: Props) {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase
        fileName={TabBars.Tabbar.fileName}
        title="React Navigation compatible Tabbar with Underline"
      >
        <TabBars.Tabbar />
      </Showcase>
      <Showcase
        fileName={TabBars.TabBarSecondExample.fileName}
        title="Progressive Tabbar with Underline Indicator"
      >
        <TabBars.TabBarSecondExample />
      </Showcase>
      <Showcase
        fileName={TabBars.TabbarSwippable.fileName}
        title="Swippable Tabbar Support Gesture Drag"
      >
        <TabBars.TabbarSwippable />
      </Showcase>
    </YStack>
  )
}

export function tabbarsGetComponentCodes() {
  return {
    codes: {
      Tabbar: '',
      TabBarSecondExample: '',
      TabbarSwippable: '',
    } as Omit<Record<keyof typeof TabBars, string>, 'getCode'>,
  }
}
