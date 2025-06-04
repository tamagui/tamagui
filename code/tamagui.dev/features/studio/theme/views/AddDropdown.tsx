import { Plus } from '@tamagui/lucide-icons'
import type { ListItemProps, PopoverProps } from 'tamagui'
import {
  Button,
  H6,
  ListItem,
  Paragraph,
  Popover,
  Separator as TamaguiSeparator,
  styled,
  withStaticProperties,
} from 'tamagui'

const Item = ({ children, ...props }: ListItemProps) => (
  <ListItem miw={190} size="$5" hoverTheme iconAfter={Plus} {...props}>
    <Paragraph userSelect="none">{children}</Paragraph>
  </ListItem>
)

const Title = styled(H6, {
  size: '$1',
  ta: 'left',
  lh: 10,
  pt: '$4',
  pb: '$2',
  px: '$3',
  o: 0.5,
})

const Separator = styled(TamaguiSeparator, { width: '100%', py: '$1' })

export const AddDropdown = withStaticProperties(
  function AddDropdown({ children, ...props }: PopoverProps) {
    return (
      <Popover size="$5" allowFlip placement="top" {...props}>
        <Popover.Trigger asChild>
          <Button theme="surface3" size="$3" circular icon={Plus} />
        </Popover.Trigger>

        <Popover.Content
          borderWidth="$0.5"
          borderColor="$borderColor"
          p={0}
          trapFocus={false}
          enterStyle={{ y: -7, opacity: 0 }}
          exitStyle={{ y: -7, opacity: 0 }}
          elevate
          maw={400}
          ai="flex-start"
          animation={[
            'quickest',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <Popover.ScrollView>{children}</Popover.ScrollView>
          <Popover.Arrow
            backgroundColor="$background"
            borderColor="$borderColor"
            borderWidth="$0.5"
          />
        </Popover.Content>
      </Popover>
    )
  },

  {
    Item,
    Separator,
    Title,
  }
)
