import { YStack } from 'tamagui'

import { Showcase } from '~/components/bento-showcase/_Showcase'
import * as TabBars from '@tamagui/bento/component/shells/tabbars'
import {
  type BentoShowcaseContext,
  BentoShowcaseProvider,
} from '~/components/bento-showcase/BentoProvider'

type Props = ReturnType<typeof tabbarsGetComponentCodes> & BentoShowcaseContext

export function tabbars({ isProUser, showAppropriateModal }: Props) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
        <Showcase
          unlock
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
    </BentoShowcaseProvider>
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
