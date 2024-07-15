import { Check, LogOut, Menu } from '@tamagui/lucide-icons'
import {
  Button,
  Checkbox,
  H6,
  Label,
  ListItem,
  Paragraph,
  Popover,
  YGroup,
  YStack,
} from 'tamagui'
import type { ThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { weakKey } from '~/helpers/weakKey'
import type { WritableKeysOf } from './types'

export const StudioThemeBuilderSettingsDropdown = () => {
  return (
    <Popover
      size="$5"
      allowFlip
      placement="bottom"
      stayInFrame={{
        padding: 10,
      }}
    >
      <Popover.Trigger asChild>
        <Button size="$2" scaleIcon={1.5} chromeless circular icon={Menu}></Button>
      </Popover.Trigger>

      <Popover.Content
        borderWidth="$0.5"
        borderColor="$borderColor"
        p={0}
        trapFocus={false}
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        maw={400}
        animation={[
          'quickest',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Popover.ScrollView>
          <YGroup alignSelf="center" width={320} size="$4">
            <H6 size="$1" lh={10} pt="$3" pb="$2" px="$3">
              Quick Settings
            </H6>

            {menuItems.settings.map((item) => {
              return <MenuItem key={weakKey(item)} item={item} />
            })}

            <H6 size="$1" lh={10} pt="$3" pb="$2" px="$3">
              Menu
            </H6>

            {menuItems.items.map((item) => {
              return <MenuItem key={weakKey(item)} item={item} />
            })}
          </YGroup>
        </Popover.ScrollView>
        <Popover.Arrow
          borderWidth={1}
          style={{ zIndex: 1 }}
          borderColor="$borderColor"
          // bottom={-17}
          // style={{ bottom: '-17px' }}
        />
      </Popover.Content>
    </Popover>
  )
}
const MenuItem = ({ item }: { item: MenuItem }) => {
  const store = useThemeBuilderStore()
  return (
    <YGroup.Item>
      <ListItem
        icon={item.icon}
        jc="flex-start"
        size="$4"
        title={item.title}
        hoverTheme
        onPress={item.onPress as any}
        {...(!item.title && {
          p: 0,
        })}
      >
        {Boolean(item.label || item.description) && (
          <Label f={1} p="$3" gap="$4" htmlFor={weakKey(item)}>
            {item.type === 'toggle' && (
              <Checkbox
                checked={!!store[item.toggleProperty]}
                onCheckedChange={(val) => {
                  store[item.toggleProperty as any] = !!val
                }}
                id={weakKey(item)}
              >
                <Checkbox.Indicator>
                  <Check />
                </Checkbox.Indicator>
              </Checkbox>
            )}
            <YStack f={1}>
              <Paragraph>{item.label}</Paragraph>
              {!!item.description && (
                <Paragraph theme="alt1" size="$2">
                  {item.description}
                </Paragraph>
              )}
            </YStack>
          </Label>
        )}
      </ListItem>
    </YGroup.Item>
  )
}

type MenuItemBase = {
  title?: string
  label?: string
  description?: string
  icon?: any
  onPress?: Function
}

type MenuItemToggle = MenuItemBase & {
  type: 'toggle'
  toggleProperty: WritableKeysOf<ThemeBuilderStore>
}

type MenuItemItem = MenuItemBase & {
  type: 'item'
}

type MenuItem = MenuItemItem | MenuItemToggle

const menuItems = {
  settings: [
    {
      type: 'toggle',
      label: 'Explanations',
      toggleProperty: 'showExplanationSteps',
      description: 'Show steps explaining themes in depth',
    },
  ],

  items: [
    {
      type: 'item',
      title: 'Logout',
      icon: LogOut,
      async onPress() {
        // TODO
        alert('todo')
        debugger
        // await getAuth()?.signOut()
        window.location.reload()
      },
    },
  ],
} satisfies Record<'settings' | 'items', MenuItem[]>
