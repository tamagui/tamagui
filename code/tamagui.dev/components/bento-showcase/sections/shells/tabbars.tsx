import { YStack } from 'tamagui'

import { Showcase } from '~/components/bento-showcase/_Showcase'
import * as TabBars from '@tamagui/bento/component/shells/tabbars'

type Props = ReturnType<typeof tabbarsGetComponentCodes>

export function tabbars() {
  return (
    <YStack
      paddingBottom="1-5 xl:0"
      gap="88px"
      paddingTop="1-5 xl:0"
      paddingRight="1-5 xl:0"
      paddingLeft="1-5 xl:0"
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
