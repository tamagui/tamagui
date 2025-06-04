import { Card, Paragraph, SizableText, Text, XStack, YStack } from 'tamagui'

import { CheckCircle } from '~/components/CheckCircle'
import { ContainerLarge } from '~/components/Containers'

const FeatureItem = ({ label, children }) => {
  return (
    <SizableText>
      <SizableText ff="$mono" size="$5" fow="800">
        {label}
      </SizableText>
      &nbsp;&nbsp;-&nbsp;&nbsp;
      <SizableText size="$5" tag="span" theme="alt2">
        {children}
      </SizableText>
    </SizableText>
  )
}

const Features = ({ items, ...props }: any) => {
  return (
    <YStack gap="$4" {...props}>
      {items.map((feature, i) => (
        <Card key={i} p="$6" elevation="$1" $sm={{ p: '$4' }}>
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

export const HomeExampleProps = () => {
  return (
    <ContainerLarge position="relative">
      <XStack px="$6" pt="$8" space="$4" $sm={{ flexDirection: 'column', px: 0 }}>
        <YStack w="50%" $sm={{ w: '100%' }}>
          <Features
            space="$4"
            items={[
              <FeatureItem key="" label="Press & hover events">
                onHoverIn, onHoverOut, onPressIn, and onPressOut.
              </FeatureItem>,
              <FeatureItem key="" label="Pseudo styles">
                Style hover, press, and focus, in combination with media queries.
              </FeatureItem>,
              <FeatureItem key="" label="Media queries">
                For every style/variant.
              </FeatureItem>,
            ]}
          />
        </YStack>
        <YStack w="50%" $sm={{ w: `100%` }}>
          <Features
            space="$4"
            items={[
              <FeatureItem key="" label="Themes">
                Change theme on any component.
              </FeatureItem>,
              <FeatureItem key="" label="Animations">
                Animate every component, enter and exit styling, works with pseudo states.
              </FeatureItem>,
              <FeatureItem key="" label="DOM escape hatches">
                Support for className and other HTML attributes.
              </FeatureItem>,
            ]}
          />
        </YStack>
      </XStack>
    </ContainerLarge>
  )
}
