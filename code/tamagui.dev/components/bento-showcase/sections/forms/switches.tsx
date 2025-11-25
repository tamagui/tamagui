import { YStack } from 'tamagui'

import * as Switches from '@tamagui/bento/component/forms/switches'
import {
  Showcase,
  WithSize,
  ShowcaseChildWrapper as Wrapper,
  usePhoneScale,
} from '~/components/bento-showcase/_Showcase'
import {
  type BentoShowcaseContext,
  BentoShowcaseProvider,
} from '~/components/bento-showcase/BentoProvider'

export function switches({ isProUser, showAppropriateModal }: BentoShowcaseContext) {
  return (
    <BentoShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          unlock
          fileName={Switches.SwitchCustomIcons.fileName}
          title="Switch with Custom Icons"
        >
          <PhoneScaleAnimationFixer>
            <Wrapper>
              <WithSize>
                <Switches.SwitchCustomIcons />
              </WithSize>
            </Wrapper>
          </PhoneScaleAnimationFixer>
        </Showcase>
        <Showcase
          fileName={Switches.IconTitleSwitch.fileName}
          title="Switch with Icon and Title"
        >
          <Wrapper>
            <Switches.IconTitleSwitch />
          </Wrapper>
        </Showcase>

        <Showcase
          defaultSize="$7"
          fileName={Switches.ThemeSwitch.fileName}
          title={Switches.ThemeSwitch.title}
        >
          <Wrapper>
            <WithSize>
              <Switches.ThemeSwitch />
            </WithSize>
          </Wrapper>
        </Showcase>
      </YStack>
    </BentoShowcaseProvider>
  )
}

const PhoneScaleAnimationFixer = ({ children }: { children: any }) => {
  const { scale, invertScale } = usePhoneScale()

  if (scale === 1) return children
  return <YStack scale={invertScale}>{children}</YStack>
}
