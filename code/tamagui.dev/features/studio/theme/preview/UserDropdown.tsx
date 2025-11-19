import { Bell, Boxes, ChevronRight, Cog, Workflow } from '@tamagui/lucide-icons'
import { Avatar, Button, H4, ListItem, Paragraph, XStack, YStack } from 'tamagui'
import { AccentTheme } from '~/features/studio/components/AccentTheme'
import { useDemoProps } from '~/features/studio/theme/hooks/useDemoProps'
import { accentTokenName } from '../../accentThemeName'

export const UserDropdown = () => {
  const demoProps = useDemoProps()

  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
    >
      <YStack borderBottomWidth="$0.25" borderBottomColor="$borderColor" pb="$4">
        <XStack gap="$4" jc="space-between" ai="center" flexWrap="wrap">
          <Avatar size="$5" {...demoProps.borderRadiusProps}>
            <Avatar.Image src="https://i.pravatar.cc/300?u=some-user" />
          </Avatar>
          <XStack ai="center" f={1} jc="space-between">
            <YStack>
              <H4 {...demoProps.headingFontFamilyProps}>John Doe</H4>
              <Paragraph theme="alt1" size="$3">
                johndoe@acme.co
              </Paragraph>
            </YStack>
          </XStack>
        </XStack>
      </YStack>

      {/* <YStack py="$2" gap="$2">
        <XStack gap="$4" ov="hidden" jc="space-around" ai="center">
          <YStack f={1}>
            <Paragraph size="$4">Usage Quota</Paragraph>
            <Paragraph size="$2" theme="alt1">
              30% &mdash; You're good for now!
            </Paragraph>
          </YStack>
          <Button size="$2">Manage</Button>
        </XStack>

        <Progress mt="$2" size="$2" value={25}>
          <Progress.Indicator animation="quick" />
        </Progress>
      </YStack> */}

      <YStack f={1} mx="$-2" gap="$2">
        <ListItem
          bg="transparent"
          hoverStyle={{
            bg: '$color3',
          }}
          {...demoProps.borderRadiusProps}
          scaleIcon={1.5}
          icon={<Cog opacity={0.75} />}
          iconAfter={<ChevronRight opacity={0.2} size={15} />}
        >
          Settings
        </ListItem>
        {/* <ListItem
          {...demoProps.borderRadiusProps}
          bg="transparent"
          hoverStyle={{
            bg: '$colo45'
          }}
          scaleIcon={1.5}
          icon={<Receipt  opacity={0.75} />}
          iconAfter={<ChevronRight opacity={0.2} size={15} />}
        >
          Bills
        </ListItem> */}
        <ListItem
          {...demoProps.borderRadiusProps}
          bw={0}
          bg="transparent"
          hoverStyle={{
            bg: '$color3',
          }}
          scaleIcon={1.5}
          icon={<Bell opacity={0.75} />}
          iconAfter={<ChevronRight opacity={0.2} size={15} />}
        >
          Notifications
        </ListItem>

        <ListItem
          {...demoProps.borderRadiusProps}
          bw={0}
          bg="transparent"
          hoverStyle={{
            bg: '$color3',
          }}
          scaleIcon={1.5}
          icon={<Workflow opacity={0.75} />}
          iconAfter={<ChevronRight opacity={0.2} size={15} />}
        >
          My Workflows
        </ListItem>

        <ListItem
          {...demoProps.borderRadiusProps}
          bw={0}
          bg="transparent"
          hoverStyle={{
            bg: '$color3',
          }}
          scaleIcon={1.5}
          icon={<Boxes opacity={0.75} />}
          iconAfter={<ChevronRight opacity={0.2} size={15} />}
        >
          Projects
        </ListItem>

        {/* <Spacer f={1} />

        <Button
          size="$2"
          theme={accentThemeName}
          themeInverse={store.inverseAccent}
          iconAfter={Plus}
          als="flex-end"
        >
          New Project
        </Button> */}
      </YStack>
    </YStack>
  )
}
