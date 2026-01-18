import { Bell, Boxes, ChevronRight, Cog, Workflow } from '@tamagui/lucide-icons'
import { Avatar, H4, ListItem, Paragraph, XStack, YStack } from 'tamagui'
import { useDemoProps } from '~/features/studio/theme/hooks/useDemoProps'

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
        <XStack gap="$4" justify="space-between" items="center" flexWrap="wrap">
          <Avatar size="$5" {...demoProps.borderRadiusProps}>
            <Avatar.Image src="https://i.pravatar.cc/300?u=some-user" />
          </Avatar>
          <XStack items="center" flex={1} flexBasis="auto" justify="space-between">
            <YStack>
              <H4 {...demoProps.headingFontFamilyProps}>John Doe</H4>
              <Paragraph theme="alt1" size="$3">
                johndoe@acme.co
              </Paragraph>
            </YStack>
          </XStack>
        </XStack>
      </YStack>

      <YStack flex={1} flexBasis="auto" mx="$-2" gap="$2">
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

        <ListItem
          {...demoProps.borderRadiusProps}
          borderWidth={0}
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
          borderWidth={0}
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
          borderWidth={0}
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
      </YStack>
    </YStack>
  )
}
