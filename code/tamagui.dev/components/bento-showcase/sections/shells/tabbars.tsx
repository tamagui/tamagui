import { YStack } from 'tamagui'

import { Showcase } from '~/components/bento-showcase/_Showcase'
import * as TabBars from '@tamagui/bento/component/shells/tabbars'

type Props = ReturnType<typeof tabbarsGetComponentCodes>

export function tabbars() {
  return (
    <YStack
      paddingBottom="2 gtLg:0"
      gap="12"
      paddingTop="2 gtLg:0"
      paddingRight="2 gtLg:0"
      paddingLeft="2 gtLg:0"
    >
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
