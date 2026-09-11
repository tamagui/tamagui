import { Plus } from '@tamagui/lucide-icons-2'
import type { ListItemProps, PopoverProps } from 'tamagui'
import {
  H6,
  ListItem,
  Paragraph,
  Popover,
  Separator as TamaguiSeparator,
  styled,
  withStaticProperties,
} from 'tamagui'
import { Button } from '~/components/Button'

const Item = ({ children, ...props }: ListItemProps) => (
  <ListItem minW={190} size="5" iconAfter={Plus} {...props}>
    <Paragraph select="none">{children}</Paragraph>
  </ListItem>
)

const Title = styled(H6, {
  size: '1',
  text: 'left',
  lineHeight: 10,
  pt: '4',
  pb: '2',
  px: '3',
  opacity: 0.5,
})

const Separator = styled(TamaguiSeparator, {
  width: '100%',
  py: '1',
})

export const AddDropdown = withStaticProperties(
  function AddDropdown({ children, ...props }: PopoverProps) {
    return (
      <Popover size="5" allowFlip placement="top" {...props}>
        <Popover.Trigger asChild>
          <Button size="3" circular icon={Plus} />
        </Popover.Trigger>

        <Popover.Content
          borderWidth="0-5"
          borderColor="border-color"
          p={0}
          y="enter:-7px exit:-7px"
          opacity="enter:0 exit:0"
          backgroundColor="background"
          boxShadow="0 4px 12px shadow-color"
          maxW={400}
          items="flex-start"
          transition={{
            preset: 'quickest',
            opacity: { preset: 'quickest', spring: { overshootClamping: true } },
          }}
          trapFocus={false}
        >
          <Popover.ScrollView>{children}</Popover.ScrollView>
          <Popover.Arrow bg="background" borderColor="border-color" borderWidth="0-5" />
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
