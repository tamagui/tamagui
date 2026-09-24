import { YStack } from 'tamagui'

import * as Switches from '@tamagui/bento/component/forms/switches'
import {
  Showcase,
  WithSize,
  ShowcaseChildWrapper as Wrapper,
  usePhoneScale,
} from '~/components/bento-showcase/_Showcase'

export function switches() {
  return (
    <YStack
      paddingBottom="1-5 xl:0"
      gap="88px"
      paddingTop="1-5 xl:0"
      paddingRight="1-5 xl:0"
      paddingLeft="1-5 xl:0"
    >
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

      <Showcase
        defaultSize="7"
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
  )
}

const PhoneScaleAnimationFixer = ({ children }: { children: any }) => {
  const { scale, invertScale } = usePhoneScale()

  if (scale === 1) return children
  return <YStack scale={invertScale}>{children}</YStack>
}
