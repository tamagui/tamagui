import { Check } from '@tamagui/lucide-icons'
import type { ListItemProps } from 'tamagui'
import { H4, ListItem, Paragraph, Spacer, YStack } from 'tamagui'
import { AccentTheme } from '../../components/AccentTheme'
import { useDemoProps } from '../hooks/useDemoProps'

export const AllTasks = () => {
  const demoProps = useDemoProps()

  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
      bg="$background"
    >
      <YStack borderBottomWidth="$0.25" borderBottomColor="$borderColor" pb="$4">
        <H4 {...demoProps.headingFontFamilyProps} color="$color">
          Tasks
        </H4>
        <Paragraph {...demoProps.panelDescriptionProps}>
          Active task for your team
        </Paragraph>
      </YStack>

      <YStack flex={1} {...demoProps.gapPropsMd}>
        <Task>
          <Paragraph size="$5" lh="$3">
            Migrate to the new version
          </Paragraph>
          <Paragraph theme="alt1" size="$2" numberOfLines={1}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum amet
          </Paragraph>
        </Task>
        <Task checked>
          <Paragraph size="$5" lh="$3" textDecorationLine="line-through">
            Make a tabs component
          </Paragraph>
          <Paragraph
            textDecorationLine="line-through"
            theme="alt1"
            size="$2"
            numberOfLines={1}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum amet
          </Paragraph>
        </Task>
        <Task checked>
          <Paragraph size="$5" lh="$3" textDecorationLine="line-through">
            Implement the design system
          </Paragraph>
          <Paragraph
            textDecorationLine="line-through"
            theme="alt1"
            size="$2"
            numberOfLines={1}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum amet
          </Paragraph>
        </Task>
        {/* <Task checked>
          <Paragraph textDecorationLine="line-through">Fix the workflow bugs</Paragraph>
          <Paragraph textDecorationLine="line-through" theme="alt1" size="$2" numberOfLines={1}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum amet
          </Paragraph>
        </Task> */}
      </YStack>

      <Spacer size="$2" />
    </YStack>
  )
}

const Task = ({
  checked,
  children,
  ...props
}: {
  checked?: boolean
} & ListItemProps) => {
  const demoProps = useDemoProps()
  return (
    <ListItem
      px="$2"
      bg="transparent"
      icon={
        <AccentTheme>
          <YStack
            als="flex-start"
            mt="$1"
            {...(checked && {
              bg: '$borderColor',
            })}
            borderColor="$borderColor"
            width="$1"
            height="$1"
            jc="center"
            ai="center"
            {...demoProps.borderRadiusProps}
          >
            {checked && <Check size={10} color="$color" />}
          </YStack>
        </AccentTheme>
      }
      {...props}
    >
      <YStack gap="$1" opacity={checked ? 0.3 : 1} ai="flex-start" f={1}>
        {children}
      </YStack>
    </ListItem>
  )
}
