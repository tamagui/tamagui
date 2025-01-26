import { YStack } from 'tamagui'

import * as Switches from '../../components/forms/switches'
import {
  Showcase,
  WithSize,
  ShowcaseChildWrapper as Wrapper,
  usePhoneScale,
} from '../../components/general/_Showcase'

export function switches() {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
      <Showcase
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
    </YStack>
  )
}

const PhoneScaleAnimationFixer = ({ children }: { children: any }) => {
  const { scale, invertScale } = usePhoneScale()

  if (scale === 1) return children
  return <YStack scale={invertScale}>{children}</YStack>
}
