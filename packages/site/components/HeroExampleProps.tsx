import { Paragraph, SizableText, Text, XStack, YStack } from 'tamagui'

import { Card } from './Card'
import { CheckCircle } from './CheckCircle'
import { ContainerLarge } from './Container'
import { HomeH2, HomeH3 } from './HomeH2'

const FeatureItem = ({ label, children }) => {
  return (
    <SizableText>
      <SizableText size="$4" fow="800">
        {label}
      </SizableText>
      &nbsp;&nbsp;—&nbsp;&nbsp;
      <SizableText size="$5" tag="span" theme="alt2">
        {children}
      </SizableText>
    </SizableText>
  )
}

const Features = ({ items, ...props }: any) => {
  return (
    <YStack space {...props}>
      {items.map((feature, i) => (
        <Card key={i} p="$4">
          <XStack tag="li">
            <Text color="$green9">
              <CheckCircle />
            </Text>
            <Paragraph color="$gray11">{feature}</Paragraph>
          </XStack>
        </Card>
      ))}
    </YStack>
  )
}

export const HeroExampleProps = () => {
  return (
    <ContainerLarge position="relative">
      <YStack ai="center" space="$2">
        <HomeH2>More in every component</HomeH2>
        <HomeH3>Productivity with powerful built-in props.</HomeH3>
      </YStack>

      <XStack px="$6" pt="$8" space="$4" $sm={{ flexDirection: 'column' }}>
        <YStack w="50%" $sm={{ w: '100%' }}>
          <Features
            space="$4"
            items={[
              <FeatureItem label="Press & hover events">
                onHoverIn, onHoverOut, onPressIn, and onPressOut.
              </FeatureItem>,
              <FeatureItem label="Pseudo styles">
                Style hover, press, and focus, in combination with media queries.
              </FeatureItem>,
              <FeatureItem label="Media queries">For every style/variant.</FeatureItem>,
            ]}
          />
        </YStack>
        <YStack w="50%" $sm={{ w: `100%` }}>
          <Features
            space="$4"
            items={[
              <FeatureItem label="Themes">Change theme on any component.</FeatureItem>,
              <FeatureItem label="Animations">
                Animate every component, enter and exit styling, works with psuedo states.
              </FeatureItem>,
              <FeatureItem label="DOM escape hatches">
                Support for className and other HTML attributes.
              </FeatureItem>,
            ]}
          />
        </YStack>
      </XStack>
    </ContainerLarge>
  )
}
