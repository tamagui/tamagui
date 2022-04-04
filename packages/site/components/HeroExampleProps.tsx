import { Paragraph, Text, XStack, YStack } from 'tamagui'

import { ContainerLarge } from './Container'
import { Features } from './Features'
import { HomeH2, HomeH3 } from './HomeH2'

const FeatureItem = ({ label, children }) => {
  return (
    <Paragraph>
      <Text fow="800">{label}</Text>&nbsp;&nbsp;—&nbsp;&nbsp;
      <Paragraph theme="alt2">{children}</Paragraph>
    </Paragraph>
  )
}

export const HeroExampleProps = () => {
  return (
    <ContainerLarge position="relative">
      <YStack ai="center" space="$2">
        <HomeH2>Save time with every component</HomeH2>
        <HomeH3>Big productivity wins with built-in props.</HomeH3>
      </YStack>

      <XStack p="$6" space="$4" $sm={{ flexDirection: 'column' }}>
        <YStack w="50%" $sm={{ w: '100%' }}>
          <Features
            space="$6"
            items={[
              <FeatureItem label="Press & hover events">
                onHoverIn, onHoverOut, onPressIn, and onPressOut.
              </FeatureItem>,
              <FeatureItem label="Pseudo styles">
                hoverStyle, pressStyle, and focusStyle. Works in combination with media queries.
              </FeatureItem>,
              <FeatureItem label="Media queries">
                Every style can be adjusted based on screen sizes, written inline without losing
                performance.
              </FeatureItem>,
            ]}
          />
        </YStack>
        <YStack w="50%" $sm={{ w: `100%` }}>
          <Features
            space="$6"
            items={[
              <FeatureItem label="Themes">
                Change themes with a single prop on all components.
              </FeatureItem>,
              <FeatureItem label="Animations">
                One line animations, easy to configure down to the property.
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
