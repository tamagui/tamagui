import type { XStackProps } from 'tamagui'
import {
  Avatar,
  H4,
  H6,
  Paragraph,
  Progress,
  Separator,
  Spacer,
  XStack,
  YStack,
} from 'tamagui'

import { accentTokenName } from '../../accentThemeName'
import { useDemoProps } from '../hooks/useDemoProps'

export const CurrentTask = () => {
  const demoProps = useDemoProps()
  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
    >
      <YStack pb="$4" p="$0">
        <H4 {...demoProps.headingFontFamilyProps}>Migrate to v2</H4>
      </YStack>

      <Separator mb="$2" />

      <YStack flex={1} gap="$4" separator={<Separator />}>
        <YStack gap="$6">
          <XStack {...demoProps.gapPropsLg}>
            <XStack {...demoProps.gapPropsMd}>
              <Avatar circular size="$3" {...demoProps.borderRadiusProps}>
                <Avatar.Image src="https://i.pravatar.cc/300?u=janeee" />
              </Avatar>
              <Paragraph size="$3">Jane Doe</Paragraph>
            </XStack>
          </XStack>

          <TaskSection title="This Sprint">
            <Paragraph size="$2" theme="alt1">
              6/8 tasks done
            </Paragraph>
            <Progress miw={100} size="$5" value={60}>
              <Progress.Indicator bg={accentTokenName} animation="quick" />
            </Progress>
          </TaskSection>

          <TaskSection title="Upcoming Sprint">
            <Paragraph size="$2" theme="alt1">
              1/8 tasks done
            </Paragraph>
            <Progress miw={100} size="$5" value={25}>
              <Progress.Indicator bg={accentTokenName} animation="quick" />
            </Progress>
          </TaskSection>
        </YStack>
      </YStack>

      <Spacer />
    </YStack>
  )
}

const TaskSection = ({
  title,
  children,
  ...props
}: {
  title: string
  children: React.ReactNode
} & XStackProps) => {
  const demoProps = useDemoProps()

  return (
    <YStack {...props} {...demoProps.gapPropsMd}>
      <H6 {...demoProps.headingFontFamilyProps} theme="alt2" size="$1" mb="$-2">
        {title}
      </H6>
      {children}
    </YStack>
  )
}
