import { ContextMenu } from '../../context-menu/src'
import { createBaseMenu } from '../../create-menu/src'
import { styled } from '@tamagui/web'

import { Menu } from '../src'

createBaseMenu()

// @ts-expect-error aesthetic frame injection is no longer part of the behavior factory
createBaseMenu({ Item: Menu.Item })

styled(Menu.Content, {
  backgroundColor: '$background',
  borderRadius: '$4',
  padding: '$3',
})

styled(Menu.Item, {
  paddingHorizontal: '$3',
  focusStyle: {
    backgroundColor: '$backgroundFocus',
  },
})

styled(ContextMenu.Content, {
  backgroundColor: '$background',
  borderWidth: 1,
})

;<Menu.Content backgroundColor="$background" borderRadius="$4" padding="$3" />
;<Menu.Group gap="$2" />
;<Menu.Label color="$color" />
;<Menu.Item paddingHorizontal="$3" paddingVertical="$2" />
;<Menu.ItemTitle color="$color" />
;<Menu.ItemSubtitle color="$colorFaint" />
;<Menu.ItemIcon width="$2" height="$2" />
;<Menu.ItemIndicator marginLeft="auto" />
;<Menu.Separator height={1} backgroundColor="$borderColor" />
;<Menu.Arrow backgroundColor="$background" />
;<Menu.ScrollView maxHeight={300}>content</Menu.ScrollView>

;<ContextMenu.Content backgroundColor="$background" borderRadius="$4" padding="$3" />
;<ContextMenu.Group gap="$2" />
;<ContextMenu.Label color="$color" />
;<ContextMenu.Item paddingHorizontal="$3" paddingVertical="$2" />
;<ContextMenu.ItemTitle color="$color" />
;<ContextMenu.ItemSubtitle color="$colorFaint" />
;<ContextMenu.ItemIcon width="$2" height="$2" />
;<ContextMenu.ItemIndicator marginLeft="auto" />
;<ContextMenu.Separator height={1} backgroundColor="$borderColor" />
;<ContextMenu.Arrow backgroundColor="$background" />
