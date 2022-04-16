import { SizableText, XStack, YStack } from 'tamagui'

import { ContainerLarge } from './Container'
import { Features } from './Features'
import { HomeH2, HomeH3 } from './HomeH2'

const FeatureItem = ({ label, children }) => {
  return (
    <SizableText>
      <SizableText size="$4" fow="800">
        {label}
      </SizableText>
      &nbsp;&nbsp;—&nbsp;&nbsp;
      <SizableText size="$5" tag="span" theme="alt1">
        {children}
      </SizableText>
    </SizableText>
  )
}

export const HeroExampleProps = () => {
  return (
    <ContainerLarge position="relative">
      <YStack ai="center" space="$2">
        <HomeH2>More props</HomeH2>
        <HomeH3>More productivity with powerful built-in props.</HomeH3>
      </YStack>

      <XStack px="$6" pt="$8" space="$6" $sm={{ flexDirection: 'column' }}>
        <YStack w="50%" $sm={{ w: '100%' }}>
          <Features
            space="$7"
            items={[
              <FeatureItem label="Press & hover events">
                onHoverIn, onHoverOut, onPressIn, and onPressOut.
              </FeatureItem>,
              <FeatureItem label="Pseudo styles">
                Style hover, press, and focus, in combination with media queries.
              </FeatureItem>,
              <FeatureItem label="Media queries">
                Every style/variant adjusted to screens.
              </FeatureItem>,
            ]}
          />
        </YStack>
        <YStack w="50%" $sm={{ w: `100%` }}>
          <Features
            space="$7"
            items={[
              <FeatureItem label="Themes">Change themes on any component.</FeatureItem>,
              <FeatureItem label="Animations">
                Animate every component, enter and exit styling, works with psuedo states.
              </FeatureItem>,
              <FeatureItem label="DOM escape hatches">
                Pass className and HTML attributes directly. On native they are ignored.
              </FeatureItem>,
            ]}
          />
        </YStack>
      </XStack>
    </ContainerLarge>
  )
}
