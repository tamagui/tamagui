import { Moon, Sun } from '@tamagui/lucide-icons'
import type { ListItemProps } from 'tamagui'
import { Button, ListItem, Spacer, Switch } from 'tamagui'
import { useThemeControl } from '../../useKitchenSinkTheme'

export const ColorSchemeListItem = (props: ListItemProps) => {
  return (
    <ListItem {...props} bg="$color1" pressTheme paddingVertical={0}>
      <ListItem.Text>Theme</ListItem.Text>
      <Spacer flex />
      <ColorSchemeToggle />
    </ListItem>
  )
}

export const ColorSchemeToggle = () => {
  const theme = useThemeControl()
  const checked = theme.value === 'light'

  return (
    <>
      <Button chromeless disabled w={20} icon={Moon} />
      <Switch
        native
        checked={checked}
        onCheckedChange={() => {
          theme.set(theme.value === 'dark' ? 'light' : 'dark')
        }}
      >
        <Switch.Thumb
          animation={[
            'quick',
            {
              transform: {
                overshootClamping: true,
              },
            },
          ]}
        />
      </Switch>
      <Button chromeless disabled w={20} icon={Sun} />
    </>
  )
}
